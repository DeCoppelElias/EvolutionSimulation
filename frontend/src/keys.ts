export type KeyAction =
    "playPause" | "inspect" | "hand" | "place" | "zoomIn" | "zoomOut" | "fit" | "step" | "escape";
export type KeyPress = { key: string; ctrl: boolean; alt: boolean; meta: boolean; typing: boolean };

const ACTIONS: Partial<Record<string, KeyAction>> = {
    " ": "playPause",
    i: "inspect",
    I: "inspect",
    h: "hand",
    H: "hand",
    p: "place",
    P: "place",
    "+": "zoomIn",
    "=": "zoomIn",
    "-": "zoomOut",
    "0": "fit",
    ".": "step",
    Escape: "escape",
};
const FIELDS = new Set(["SELECT", "TEXTAREA"]);
const TEXT_INPUTS = new Set(["", "text", "number", "search", "email", "password", "url", "tel"]);

/** A modifier leaves the key to the browser, and typing leaves it to the field. */
export function actionFor(press: KeyPress): KeyAction | null {
    if (press.ctrl || press.alt || press.meta || press.typing) return null;
    return ACTIONS[press.key] ?? null;
}

/** An input that takes keys, so not a slider, a checkbox or a button. */
export function isTyping(tagName: string, type: string, editable: boolean): boolean {
    if (tagName === "INPUT") return TEXT_INPUTS.has(type);
    return editable || FIELDS.has(tagName);
}
