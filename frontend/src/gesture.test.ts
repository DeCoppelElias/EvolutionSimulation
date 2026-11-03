import { describe, expect, test } from "vitest";
import { DRAG_PX, isClick, moved, pressed } from "./gesture";

describe("a press", () => {
    test("that moves under 4 pixels stays a click", () => {
        expect(isClick(moved(pressed(10, 10), 12.5, 12.5))).toBe(true);
    });

    test("that moves 4 pixels becomes a drag", () => {
        expect(DRAG_PX).toBe(4);
        expect(isClick(moved(pressed(10, 10), 14, 10))).toBe(false);
    });

    test("stays a drag once it has been one, even back at its start", () => {
        expect(isClick(moved(moved(pressed(0, 0), 10, 0), 0, 0))).toBe(false);
    });
});
