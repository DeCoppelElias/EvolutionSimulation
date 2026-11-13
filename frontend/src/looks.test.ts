import { describe, expect, test } from "vitest";
import { creatureLook, ghostLook, lookOf } from "./looks";
import { marking } from "./markings";
import sheet from "./sprites.json";

const drawn = (spriteKey: string, frame: string, creature = true, id = 4) => ({
    id,
    spriteKey,
    creature,
    frame,
});

describe("a look", () => {
    test("is a creature's frame in its unmarked palette until it has a marking", () => {
        expect(lookOf(drawn("rabbit", "air"), null)).toEqual({
            key: "rabbit/air/plain",
            grid: sheet.rabbit.frames.air,
            palette: sheet.rabbit.palette,
        });
    });

    test("with a marking is keyed by it and painted with it", () => {
        const look = lookOf(drawn("rabbit", "air"), { colour: 3, extent: 2, accent: 1 });
        expect(look?.key).toBe("rabbit/air/3.2.1");
        const colour = sheet.rabbit.marks.colours[3].marked.t;
        expect(look?.palette).toMatchObject({ t: colour, h: colour, f: colour, c: "#ffffff" });
    });

    test("falls back to standing for a frame the species does not draw", () => {
        expect(lookOf(drawn("rabbit", "stride"), null)?.grid).toBe(sheet.rabbit.frames.stand);
        expect(lookOf(drawn("rabbit", "stride"), null)?.key).toBe("rabbit/stand/plain");
    });

    test("for grass is a tuft picked by its id", () => {
        expect(lookOf(drawn("grass", "stand", false, 5), null)).toEqual({
            key: "grass/2",
            grid: sheet.grass.tufts[2],
            palette: sheet.grass.palette,
        });
    });

    test("is missing for a species with no art", () => {
        expect(lookOf(drawn("deer", "stand"), null)).toBeNull();
        expect(lookOf(drawn("mushroom", "stand", false), null)).toBeNull();
    });
});

describe("a ghost", () => {
    test("is a creature's standing look, unmarked", () => {
        expect(ghostLook("rabbit")?.key).toBe("rabbit/stand/plain");
    });

    test("for ground cover is its first tuft", () => {
        expect(ghostLook("grass")?.key).toBe("grass/0");
    });

    test("for a species with no art is none", () => {
        expect(ghostLook("dragon")).toBeNull();
    });
});

describe("a creature's own look", () => {
    const ranges = [
        { key: "speed", min: 0, max: 1, baseline: 0.5 },
        { key: "viewRange", min: 1, max: 6, baseline: 3 },
    ];
    const rabbit = {
        id: 14,
        species: "rabbit",
        spriteKey: "rabbit",
        creature: true,
        info: {},
        genes: { speed: 0.9, viewRange: 1.5 },
    };

    test("stands in the markings its genes give it", () => {
        const chosen = marking("rabbit", rabbit.genes, ranges);
        const key = `rabbit/stand/${chosen.colour}.${chosen.extent}.${chosen.accent}`;
        expect(creatureLook(rabbit, { rabbit: ranges })?.key).toBe(key);
    });

    test("is unmarked until the gene ranges arrive", () => {
        expect(creatureLook(rabbit, null)?.key).toBe("rabbit/stand/plain");
    });

    test("for grass is its tuft", () => {
        const grass = { ...rabbit, id: 5, species: "grass", spriteKey: "grass", creature: false };
        expect(creatureLook(grass, { rabbit: ranges })?.key).toBe("grass/2");
    });
});
