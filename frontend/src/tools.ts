export type Tool = "inspect" | "hand" | "place";
export type Tools = { tool: Tool; listOpen: boolean };
export type Escapable = { tools: Tools; panelOpen: boolean; selected: boolean };
export type EscapeStep = "closeList" | "disarm" | "closePanel" | "clearSelection";

export const INSPECTING: Tools = { tool: "inspect", listOpen: false };

/** Place's button opens its list, then closes it, then goes back to Inspect. */
export function choose(tools: Tools, tool: Tool): Tools {
    if (tool !== "place") return { tool, listOpen: false };
    if (tools.tool !== "place") return { tool: "place", listOpen: true };
    return tools.listOpen ? { tool: "place", listOpen: false } : INSPECTING;
}

export function speciesChosen(): Tools {
    return { tool: "place", listOpen: false };
}

export function rightClicked(): Tools {
    return INSPECTING;
}

/** Esc undoes one thing at a time, nearest first. */
export function escapeStep(state: Escapable): EscapeStep | null {
    if (state.tools.listOpen) return "closeList";
    if (state.tools.tool !== "inspect") return "disarm";
    if (state.panelOpen) return "closePanel";
    if (state.selected) return "clearSelection";
    return null;
}
