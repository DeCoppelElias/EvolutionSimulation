import { describe, expect, test } from "vitest";
import { dithered, meadow, shadeAt, surround } from "./meadow";
import sheet from "./sprites.json";
import { groundVariant } from "./tiles";

/** The mean shade over each tile of a w by h world. */
function tileMeans(w: number, h: number): number[][] {
    return Array.from({ length: h }, (_, ty) =>
        Array.from({ length: w }, (_, tx) => {
            let sum = 0;
            for (let y = 0; y < 16; y++)
                for (let x = 0; x < 16; x++) sum += shadeAt(tx * 16 + x, ty * 16 + y);
            return sum / 256;
        }),
    );
}

describe("dithering", () => {
    test("a whole shade fills its block", () => {
        const block = Array.from({ length: 16 }, (_, i) => dithered(1, i % 4, Math.floor(i / 4)));
        expect(new Set(block)).toEqual(new Set([1]));
    });

    test("halfway between two shades mixes them evenly in a 4 by 4 block", () => {
        const block = Array.from({ length: 16 }, (_, i) => dithered(1.5, i % 4, Math.floor(i / 4)));
        expect(block.filter((shade) => shade === 1)).toHaveLength(8);
        expect(block.filter((shade) => shade === 2)).toHaveLength(8);
    });

    test("never leaves the shades there are", () => {
        expect(dithered(-1, 0, 0)).toBe(0);
        expect(dithered(9, 3, 3)).toBe(3);
    });
});

describe("the meadow's shade", () => {
    test("is the same every time", () => {
        expect(shadeAt(77, 140)).toBe(shadeAt(77, 140));
    });

    test("uses at least three shades in patches that change gently from tile to tile", () => {
        const seen = new Set<number>();
        for (let y = 0; y < 320; y += 3) for (let x = 0; x < 320; x += 3) seen.add(shadeAt(x, y));
        expect(seen.size).toBeGreaterThanOrEqual(3);
        for (const row of tileMeans(20, 20))
            for (let x = 1; x < row.length; x++)
                expect(Math.abs(row[x] - row[x - 1])).toBeLessThan(0.75);
    });
});

describe("the meadow's pixels", () => {
    const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const colours = new Set(
        sheet.ground.shades.flatMap((shade) => Object.values(shade).map((hex) => rgb(hex).join())),
    );

    test("cover exactly the world", () => {
        const pixels = meadow(3, 2);
        expect(pixels.width).toBe(48);
        expect(pixels.height).toBe(32);
    });

    test("in the world are all ground shades", () => {
        const pixels = meadow(3, 2);
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 48; x++) {
                const at = (y * 48 + x) * 4;
                expect(colours.has([...pixels.data.slice(at, at + 3)].join())).toBe(true);
            }
        }
    });

    test("around the world are a square of tiles darker than any ground shade", () => {
        const pixels = surround(2);
        expect(pixels.width).toBe(32);
        expect(pixels.height).toBe(32);
        const darkest = Math.min(...[...colours].map((c) => Number(c.split(",")[1])));
        for (let at = 0; at < pixels.data.length; at += 4) {
            expect(pixels.data[at + 1]).toBeLessThan(darkest);
        }
    });

    test("around the world have no patches, so the square repeats without a seam", () => {
        const pixels = surround(4);
        const tileOf = (tx: number, ty: number) => {
            const rows: string[] = [];
            for (let y = 0; y < 16; y++) {
                const at = ((ty * 16 + y) * 64 + tx * 16) * 4;
                rows.push([...pixels.data.slice(at, at + 64)].join());
            }
            return rows.join("|");
        };
        const byVariant = new Map<number, string>();
        for (let ty = 0; ty < 4; ty++) {
            for (let tx = 0; tx < 4; tx++) {
                const seen = byVariant.get(groundVariant(tx, ty));
                if (seen === undefined) byVariant.set(groundVariant(tx, ty), tileOf(tx, ty));
                else expect(tileOf(tx, ty)).toBe(seen);
            }
        }
        expect(byVariant.size).toBeGreaterThan(1);
    });
});
