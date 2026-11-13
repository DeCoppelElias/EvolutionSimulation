import { marking, markedPalette, type Marking, type Marks } from "./markings";
import type { Drawn } from "./motion";
import type { Palette } from "./pixels";
import sheet from "./sprites.json";
import { tuftOf } from "./tiles";
import type { EntityView, GeneRanges } from "./types";

/** What a sprite is drawn from, and the key its texture is cached under. */
export type Look = { key: string; grid: readonly string[]; palette: Palette };

type Kind = { palette: Palette; marks: Marks; frames: Partial<Record<string, string[]>> };

const KINDS: Partial<Record<string, Kind>> = { rabbit: sheet.rabbit, wolf: sheet.wolf };
const GROUND_COVER: Partial<Record<string, { tufts: string[][]; palette: Palette }>> = {
    grass: sheet.grass,
};

/** Null for a species with no art. */
export function lookOf(
    placed: Pick<Drawn, "id" | "spriteKey" | "creature" | "frame">,
    chosen: Marking | null,
): Look | null {
    if (!placed.creature) {
        const cover = GROUND_COVER[placed.spriteKey];
        if (cover === undefined) return null;
        const tuft = tuftOf(placed.id) % cover.tufts.length;
        return {
            key: `${placed.spriteKey}/${tuft}`,
            grid: cover.tufts[tuft],
            palette: cover.palette,
        };
    }
    const kind = KINDS[placed.spriteKey];
    if (kind === undefined) return null;
    const frame = kind.frames[placed.frame] !== undefined ? placed.frame : "stand";
    const grid = kind.frames[frame];
    if (grid === undefined) return null;
    const marked = chosen === null ? "plain" : `${chosen.colour}.${chosen.extent}.${chosen.accent}`;
    return {
        key: `${placed.spriteKey}/${frame}/${marked}`,
        grid,
        palette: chosen === null ? kind.palette : markedPalette(kind, chosen),
    };
}

/** What Place shows under the cursor, and the picker beside a count. */
export function ghostLook(spriteKey: string): Look | null {
    const shown = { id: 0, spriteKey, frame: "stand" };
    return (
        lookOf({ ...shown, creature: true }, null) ?? lookOf({ ...shown, creature: false }, null)
    );
}

/** How the Inspector shows a creature: standing, in the markings its genes give it on the grid. */
export function creatureLook(entity: EntityView, ranges: GeneRanges | null): Look | null {
    const own = ranges?.[entity.species];
    const chosen =
        entity.creature && own !== undefined ? marking(entity.species, entity.genes, own) : null;
    return lookOf(
        { id: entity.id, spriteKey: entity.spriteKey, creature: entity.creature, frame: "stand" },
        chosen,
    );
}
