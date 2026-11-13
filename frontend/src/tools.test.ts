import { describe, expect, test } from "vitest";
import { INSPECTING, choose, escapeStep, rightClicked, speciesChosen } from "./tools";

describe("the tools", () => {
    test("start on Inspect", () => {
        expect(INSPECTING).toEqual({ tool: "inspect", listOpen: false });
    });

    test("Place opens its list, closes it, then goes back to Inspect", () => {
        const open = choose(INSPECTING, "place");
        expect(open).toEqual({ tool: "place", listOpen: true });
        const armed = choose(open, "place");
        expect(armed).toEqual({ tool: "place", listOpen: false });
        expect(choose(armed, "place")).toEqual(INSPECTING);
    });

    test("picking a species arms Place and closes the list", () => {
        expect(speciesChosen()).toEqual({ tool: "place", listOpen: false });
    });

    test("another tool closes the list", () => {
        expect(choose({ tool: "place", listOpen: true }, "hand")).toEqual({
            tool: "hand",
            listOpen: false,
        });
    });

    test("a right click goes back to Inspect", () => {
        expect(rightClicked()).toEqual(INSPECTING);
    });
});

describe("Esc", () => {
    const base = { tools: INSPECTING, panelOpen: false, selected: false };

    test("closes the list first", () => {
        const listed = {
            ...base,
            tools: { tool: "place" as const, listOpen: true },
            panelOpen: true,
        };
        expect(escapeStep(listed)).toBe("closeList");
    });

    test("then disarms the tool", () => {
        const armed = {
            ...base,
            tools: { tool: "place" as const, listOpen: false },
            panelOpen: true,
        };
        expect(escapeStep(armed)).toBe("disarm");
        expect(escapeStep({ ...base, tools: { tool: "hand", listOpen: false } })).toBe("disarm");
    });

    test("then closes the panel", () => {
        expect(escapeStep({ ...base, panelOpen: true, selected: true })).toBe("closePanel");
    });

    test("then clears the selection", () => {
        expect(escapeStep({ ...base, selected: true })).toBe("clearSelection");
    });

    test("then does nothing", () => {
        expect(escapeStep(base)).toBeNull();
    });
});
