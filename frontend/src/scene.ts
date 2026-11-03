import {
    Application,
    CanvasSource,
    Container,
    Graphics,
    Sprite,
    Texture,
    TilingSprite,
} from "pixi.js";
import { chip } from "./chip";
import { ghostLook, lookOf } from "./looks";
import { marking, type Marking } from "./markings";
import { meadow, surround } from "./meadow";
import { frameAt, settledMs, type Drawn, type Transition } from "./motion";
import { advance, START, type Playback } from "./playback";
import { rasterize, type Palette, type Pixels } from "./pixels";
import { ART_TILE } from "./scale";
import { depth, stacks } from "./tiles";
import type { GeneRanges, GridPosition, PlayState, WorldSnapshot } from "./types";
import type { Size, View } from "./viewport";

const CHIP_COLOURS = { o: "#1a1f2b", w: "#ffffff" };
/** Tiles across the block of dimmed meadow repeated around the world. */
const SURROUND_TILES = 16;
const BORDER = { width: 1, color: "#1a1f2b", alpha: 0.45 };

/** The PixiJS side of the grid: the world drawn in art pixels, placed and scaled by the view. */
export class Scene {
    private readonly world = new Container();
    private readonly border = new Graphics();
    private readonly ghost = new Sprite();
    private readonly cover = new Container();
    private readonly sightLayer = new Graphics();
    private readonly creatures = new Container();
    private readonly chips = new Container();
    private readonly pool = new Map<number, Sprite>();
    private readonly textures = new Map<string, Texture>();
    private readonly markings = new Map<number, Marking | null>();
    private readonly reported = new Set<string>();
    private playback: Playback = START;
    private genes: GeneRanges | null = null;
    private transition: Transition | null = null;
    private started = 0;
    /** The day whose chips wait for its moves to land. */
    private unsettled: WorldSnapshot | null = null;
    private view: View = { scale: 1, x: 0, y: 0, following: true };

    private constructor(
        private readonly app: Application,
        private readonly around: TilingSprite,
        private readonly width: number,
        private readonly height: number,
        private readonly onError: (message: string) => void,
    ) {}

    static async create(
        host: HTMLElement,
        width: number,
        height: number,
        area: Size,
        background: string,
        onError: (message: string) => void,
    ): Promise<Scene> {
        const app = new Application();
        await app.init({
            width: area.width,
            height: area.height,
            background,
            antialias: false,
            roundPixels: true,
        });
        const surroundTexture = textureFrom(surround(SURROUND_TILES));
        const around = new TilingSprite({
            texture: surroundTexture,
            width: area.width,
            height: area.height,
        });
        const scene = new Scene(app, around, width, height, onError);
        scene.textures.set("surround", surroundTexture);
        scene.creatures.sortableChildren = true;
        scene.ghost.anchor.set(0.5, 1);
        scene.ghost.alpha = 0.5;
        scene.ghost.visible = false;
        const ground = new Sprite(scene.groundTexture());
        scene.world.addChild(
            ground,
            scene.cover,
            scene.sightLayer,
            scene.creatures,
            scene.ghost,
            scene.chips,
        );
        app.stage.addChild(around, scene.border, scene.world);
        app.ticker.add(() => scene.draw());
        host.appendChild(app.canvas);
        return scene;
    }

    setArea(area: Size): void {
        this.app.renderer.resize(area.width, area.height);
        this.around.width = area.width;
        this.around.height = area.height;
        this.layout();
    }

    setView(view: View): void {
        this.view = view;
        this.layout();
    }

    setBackground(colour: string): void {
        this.app.renderer.background.color = colour;
    }

    /** Place's preview: the species standing on the hovered tile, half seen. */
    setGhost(at: GridPosition | null, spriteKey: string | null): void {
        const look = spriteKey === null ? null : ghostLook(spriteKey);
        if (at === null || look === null) {
            this.ghost.visible = false;
            return;
        }
        this.ghost.texture = this.texture(look.key, look.grid, look.palette);
        this.ghost.position.set(at.x * ART_TILE + ART_TILE / 2, (at.y + 1) * ART_TILE);
        this.ghost.visible = true;
    }

    setGenes(genes: GeneRanges | null): void {
        this.genes = genes;
        this.markings.clear();
    }

    show(next: WorldSnapshot, play: PlayState): void {
        const step = advance(this.playback, next, play);
        if (step.newRun) {
            for (const sprite of this.pool.values()) sprite.destroy();
            this.pool.clear();
            this.markings.clear();
        }
        for (const id of step.gone) this.markings.delete(id);
        this.playback = step.state;
        this.transition = step.transition;
        this.started = performance.now();
        this.unsettled = next;
        if (step.newRun) this.settle();
    }

    showSight(tiles: GridPosition[]): void {
        this.sightLayer.clear();
        for (const at of tiles) {
            this.sightLayer.rect(at.x * ART_TILE, at.y * ART_TILE, ART_TILE, ART_TILE);
        }
        if (tiles.length > 0) {
            this.sightLayer.fill({ color: "#fff7a8", alpha: 0.45 });
        }
    }

    destroy(): void {
        this.app.destroy(true, { children: true });
        for (const texture of this.textures.values()) texture.destroy(true);
    }

    private draw(): void {
        const transition = this.transition;
        if (transition === null) {
            return;
        }
        const now = performance.now();
        if (this.unsettled !== null && now - this.started >= settledMs(transition)) {
            this.settle();
        }
        const seen = new Set<number>();
        for (const placed of frameAt(transition, now - this.started, now)) {
            const texture = this.textureOf(placed);
            if (texture === null) {
                continue;
            }
            let sprite = this.pool.get(placed.id);
            if (sprite === undefined) {
                sprite = new Sprite(texture);
                sprite.anchor.set(0.5, 1);
                this.pool.set(placed.id, sprite);
                (placed.creature ? this.creatures : this.cover).addChild(sprite);
            }
            sprite.texture = texture;
            sprite.position.set(
                Math.round(placed.x * ART_TILE + ART_TILE / 2 + placed.ox),
                Math.round(placed.y * ART_TILE + ART_TILE + placed.oy - placed.lift),
            );
            sprite.scale.x = placed.flipped ? -1 : 1;
            sprite.zIndex = depth(placed);
            sprite.alpha = placed.alpha;
            seen.add(placed.id);
        }
        for (const [id, sprite] of this.pool) {
            if (!seen.has(id)) {
                sprite.destroy();
                this.pool.delete(id);
            }
        }
    }

    private settle(): void {
        if (this.unsettled !== null) this.drawChips(this.unsettled);
        this.unsettled = null;
    }

    private drawChips(snapshot: WorldSnapshot): void {
        this.chips.removeChildren().forEach((child) => child.destroy());
        for (const stack of stacks(snapshot)) {
            const grid = chip(stack.creatures);
            if (grid === null) continue;
            const sprite = new Sprite(this.texture(`chip/${stack.creatures}`, grid, CHIP_COLOURS));
            sprite.position.set((stack.x + 1) * ART_TILE - grid[0].length, stack.y * ART_TILE);
            this.chips.addChild(sprite);
        }
    }

    private textureOf(placed: Drawn): Texture | null {
        const look = lookOf(placed, placed.creature ? this.markingOf(placed.id) : null);
        if (look === null) {
            if (!this.reported.has(placed.spriteKey)) {
                this.reported.add(placed.spriteKey);
                this.onError(`There is no sprite for ${placed.spriteKey}, so it is not drawn.`);
            }
            return null;
        }
        return this.texture(look.key, look.grid, look.palette);
    }

    /** Computed once per creature, since its genes never change; unmarked until the ranges arrive. */
    private markingOf(id: number): Marking | null {
        const cached = this.markings.get(id);
        if (cached !== undefined) return cached;
        const entity = this.playback.entities.get(id);
        const ranges = entity === undefined ? undefined : this.genes?.[entity.species];
        if (entity === undefined || ranges === undefined) return null;
        const chosen = marking(entity.species, entity.genes, ranges);
        this.markings.set(id, chosen);
        return chosen;
    }

    private texture(key: string, grid: readonly string[], palette: Palette): Texture {
        const made = this.textures.get(key);
        if (made !== undefined) return made;
        const texture = textureFrom(rasterize(grid, palette));
        this.textures.set(key, texture);
        return texture;
    }

    private layout(): void {
        const { scale, x, y } = this.view;
        this.world.position.set(x, y);
        this.world.scale.set(scale);
        this.around.tileScale.set(scale);
        this.around.tilePosition.set(x, y);
        const widthPx = this.width * ART_TILE * scale;
        const heightPx = this.height * ART_TILE * scale;
        this.border
            .clear()
            .rect(x - 0.5, y - 0.5, widthPx + 1, heightPx + 1)
            .stroke(BORDER);
    }

    /** The meadow under the world is drawn once. */
    private groundTexture(): Texture {
        const texture = textureFrom(meadow(this.width, this.height));
        this.textures.set("ground", texture);
        return texture;
    }
}

function textureFrom(pixels: Pixels): Texture {
    const canvas = document.createElement("canvas");
    canvas.width = pixels.width;
    canvas.height = pixels.height;
    canvas
        .getContext("2d")
        ?.putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0);
    return new Texture({ source: new CanvasSource({ resource: canvas, scaleMode: "nearest" }) });
}
