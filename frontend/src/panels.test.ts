import { describe, expect, test } from "vitest";
import { PANELS, afterInspect, pressedPanel } from "./panels";

describe("the panels", () => {
    test("are five, in the bar's order", () => {
        expect(PANELS.map((panel) => panel.name)).toEqual([
            "Inspector",
            "Creatures",
            "Population",
            "Settings",
            "World",
        ]);
    });

    test("a bar button opens its panel in place of the open one", () => {
        expect(pressedPanel("population", "settings")).toBe("settings");
    });

    test("the open panel's button closes it", () => {
        expect(pressedPanel("settings", "settings")).toBeNull();
    });

    test("a click on a creature opens the Inspector over any panel", () => {
        expect(afterInspect("population", true)).toBe("inspector");
        expect(afterInspect(null, true)).toBe("inspector");
    });

    test("a click on empty ground leaves the open panel as it is", () => {
        expect(afterInspect("inspector", false)).toBe("inspector");
        expect(afterInspect(null, false)).toBeNull();
    });
});
