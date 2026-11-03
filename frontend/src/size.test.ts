import { describe, expect, test } from "vitest";
import { DEFAULT_SIDE, readSide } from "./size";

describe("a world's side", () => {
    test("is 20 when left empty", () => {
        expect(DEFAULT_SIDE).toBe(20);
        expect(readSide(" ", "width")).toEqual({ kind: "side", side: 20 });
    });

    test("accepts 5 to 25", () => {
        expect(readSide("5", "width")).toEqual({ kind: "side", side: 5 });
        expect(readSide("25", "height")).toEqual({ kind: "side", side: 25 });
    });

    test("refuses 4 and 26 with a message naming the range", () => {
        expect(readSide("4", "width")).toEqual({
            kind: "invalid",
            reason: "the width is 5 to 25 tiles, got 4",
        });
        expect(readSide("26", "height")).toEqual({
            kind: "invalid",
            reason: "the height is 5 to 25 tiles, got 26",
        });
    });

    test("refuses anything but a whole number", () => {
        expect(readSide("7.5", "width")).toEqual({
            kind: "invalid",
            reason: "the width is a whole number of tiles",
        });
        expect(readSide("ten", "height").kind).toBe("invalid");
    });
});
