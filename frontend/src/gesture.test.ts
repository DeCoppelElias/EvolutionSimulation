import { describe, expect, test } from "vitest";
import { DRAG_PX, isClick, moved, pressed, wheeled } from "./gesture";

describe("a press", () => {
    test("that moves under 4 pixels stays a click", () => {
        expect(isClick(moved(pressed(10, 10), 12.5, 12.5))).toBe(true);
    });

    test("that moves 4 pixels becomes a drag", () => {
        expect(DRAG_PX).toBe(4);
        expect(isClick(moved(pressed(10, 10), 14, 10))).toBe(false);
    });

    test("measures the straight distance, so 3 across and 3 down is a drag", () => {
        expect(isClick(moved(pressed(0, 0), 2, 2))).toBe(true);
        expect(isClick(moved(pressed(0, 0), 3, 3))).toBe(false);
    });

    test("stays a drag once it has been one, even back at its start", () => {
        expect(isClick(moved(moved(pressed(0, 0), 10, 0), 0, 0))).toBe(false);
    });
});

describe("the wheel", () => {
    test("steps once a notch's worth has built up, upwards zooming in", () => {
        expect(wheeled(0, -100, 0)).toEqual({ steps: 1, left: 0 });
        expect(wheeled(0, 100, 0)).toEqual({ steps: -1, left: 0 });
    });

    test("adds up a trackpad's small movements before stepping", () => {
        const first = wheeled(0, -30, 0);
        expect(first).toEqual({ steps: 0, left: -30 });
        const second = wheeled(first.left, -30, 0);
        expect(second.steps).toBe(0);
        expect(wheeled(second.left, -50, 0)).toEqual({ steps: 1, left: -10 });
    });

    test("counts one line as a notch", () => {
        expect(wheeled(0, -3, 1)).toEqual({ steps: 1, left: 0 });
    });

    test("ignores a sideways swipe", () => {
        expect(wheeled(-40, 0, 0)).toEqual({ steps: 0, left: -40 });
    });

    test("steps at most once per event, however far it spins", () => {
        expect(wheeled(0, -1000, 0)).toEqual({ steps: 1, left: 0 });
    });
});
