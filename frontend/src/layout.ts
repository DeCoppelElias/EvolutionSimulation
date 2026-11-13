import type { Size } from "./viewport";

export const DRAWER_PX = 440;
export const RAIL_PX = 48;
export const MIN_WORLD_PX = 320;
export const NARROW_BELOW = DRAWER_PX + RAIL_PX + MIN_WORLD_PX;
/** The share of the world area an open sheet covers on a narrow window. */
export const SHEET = 0.55;

export type Layout = { narrow: boolean; folded: boolean };

/** The bar's full width is measured from a hidden copy, and stays whole until it has been. */
export function layoutFor(windowWidth: number, barNeeds: number | null): Layout {
    return {
        narrow: windowWidth < NARROW_BELOW,
        folded: barNeeds !== null && barNeeds > windowWidth,
    };
}

export function visibleArea(area: Size, narrow: boolean, panelOpen: boolean): Size {
    if (!narrow || !panelOpen) return area;
    return { width: area.width, height: Math.round(area.height * (1 - SHEET)) };
}
