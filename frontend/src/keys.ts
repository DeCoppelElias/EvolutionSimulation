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
const FIELDS = new Set(["INPUT", "SELECT", "TEXTAREA"]);

/** A modifier leaves the key to the browser, and typing leaves it to the field. */
export function actionFor(press: KeyPress): KeyAction | null {
    if (press.ctrl || press.alt || press.meta || press.typing) return null;
    return ACTIONS[press.key] ?? null;
}

export function isTyping(tagName: string, editable: boolean): boolean {
    return editable || FIELDS.has(tagName);
}
