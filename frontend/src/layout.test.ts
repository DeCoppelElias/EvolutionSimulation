import { describe, expect, test } from "vitest";
import { NARROW_BELOW, layoutFor, visibleArea } from "./layout";

describe("the layout", () => {
    test("goes narrow where a drawer would leave the world under 320 pixels", () => {
        expect(NARROW_BELOW).toBe(440 + 48 + 320);
        expect(layoutFor(807, 600).narrow).toBe(true);
        expect(layoutFor(808, 600).narrow).toBe(false);
    });

    test("folds the bar when its full width does not fit", () => {
        expect(layoutFor(1366, 1100).folded).toBe(false);
        expect(layoutFor(1000, 1100).folded).toBe(true);
    });

    test("keeps the bar whole until it has been measured", () => {
        expect(layoutFor(390, null).folded).toBe(false);
    });
});

describe("the part of the world no sheet covers", () => {
    test("is all of it on a wide window or with no panel open", () => {
        const area = { width: 390, height: 600 };
        expect(visibleArea(area, false, true)).toEqual(area);
        expect(visibleArea(area, true, false)).toEqual(area);
    });

    test("is the top 45% under an open sheet", () => {
        expect(visibleArea({ width: 390, height: 600 }, true, true)).toEqual({
            width: 390,
            height: 270,
        });
    });
});
