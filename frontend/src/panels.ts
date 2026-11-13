export type Panel = "inspector" | "creatures" | "population" | "settings" | "world";

export const PANELS: { key: Panel; name: string }[] = [
    { key: "inspector", name: "Inspector" },
    { key: "creatures", name: "Creatures" },
    { key: "population", name: "Population" },
    { key: "settings", name: "Settings" },
    { key: "world", name: "World" },
];

export function pressedPanel(open: Panel | null, pressed: Panel): Panel | null {
    return open === pressed ? null : pressed;
}

/** A click that picks a creature opens the Inspector; one on empty ground changes nothing. */
export function afterInspect(open: Panel | null, picked: boolean): Panel | null {
    return picked ? "inspector" : open;
}
