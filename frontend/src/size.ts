export const MIN_SIDE = 5;
export const MAX_SIDE = 25;
export const DEFAULT_SIDE = 20;

export type SideInput = { kind: "side"; side: number } | { kind: "invalid"; reason: string };

/** The page's range; the server accepts down to 1 for agents and tests. */
export function readSide(text: string, name: "width" | "height"): SideInput {
    const trimmed = text.trim();
    if (trimmed === "") return { kind: "side", side: DEFAULT_SIDE };
    if (!/^\d+$/.test(trimmed)) {
        return {
            kind: "invalid",
            reason: `the ${name} is a whole number from ${MIN_SIDE} to ${MAX_SIDE} tiles`,
        };
    }
    const side = Number(trimmed);
    if (side < MIN_SIDE || side > MAX_SIDE) {
        return {
            kind: "invalid",
            reason: `the ${name} is ${MIN_SIDE} to ${MAX_SIDE} tiles, got ${side}`,
        };
    }
    return { kind: "side", side };
}
