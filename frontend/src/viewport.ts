import { ART_TILE } from "./scale";
import type { GridPosition } from "./types";

export const MIN_SCALE = 1;
export const MAX_SCALE = 12;

/** Device pixels on screen, or tiles for a world. */
export type Size = { width: number; height: number };
export type Point = { x: number; y: number };
/** The world's top-left corner in device pixels, and how many device pixels draw one art pixel. */
export type View = { scale: number; x: number; y: number; following: boolean };
/** The canvas, the part of it no sheet covers, whether the window is narrow, and the top scale. */
export type Frame = { area: Size; visible: Size; narrow: boolean; maxScale: number };
export type Viewport = { tiles: Size; frame: Frame | null; view: View | null };
export type ViewAction =
    | { type: "frame"; frame: Frame; keep: GridPosition | null }
    | { type: "zoom"; steps: number; at?: Point }
    | { type: "pinch"; scale: number; at: Point }
    | { type: "pan"; dx: number; dy: number }
    | { type: "fit" };

const clampScale = (scale: number, max: number) => Math.min(max, Math.max(MIN_SCALE, scale));
const tilePx = (scale: number) => ART_TILE * scale;

/** The top scale in device pixels, so the closest zoom looks the same on any screen. */
export function maxScaleFor(ratio: number): number {
    return Math.round(MAX_SCALE * ratio);
}

/** A tile's size in CSS pixels, which is what the zoom reads as. */
export function tileLabel(scale: number, ratio: number): string {
    return `${Math.round((ART_TILE * scale) / ratio)} px`;
}

/** On a narrow window the smallest scale that fills its shorter side, else the largest that shows the whole world. */
export function fitScale(tiles: Size, area: Size, narrow: boolean, max = MAX_SCALE): number {
    const across = area.width / (tiles.width * ART_TILE);
    const down = area.height / (tiles.height * ART_TILE);
    if (narrow) return clampScale(Math.ceil(area.width <= area.height ? across : down), max);
    return clampScale(Math.floor(Math.min(across, down)), max);
}

/** An axis that fits is centred; one that overflows stops one tile past each edge. */
export function clampAxis(offset: number, worldPx: number, viewPx: number, margin: number): number {
    if (worldPx <= viewPx) return Math.floor((viewPx - worldPx) / 2);
    return Math.round(Math.min(margin, Math.max(viewPx - worldPx - margin, offset)));
}

function placed(view: View, tiles: Size, visible: Size): View {
    const tile = tilePx(view.scale);
    return {
        ...view,
        x: clampAxis(view.x, tiles.width * tile, visible.width, tile),
        y: clampAxis(view.y, tiles.height * tile, visible.height, tile),
    };
}

export function fitted(
    tiles: Size,
    area: Size,
    visible: Size,
    narrow: boolean,
    max = MAX_SCALE,
): View {
    const scale = fitScale(tiles, area, narrow, max);
    const tile = tilePx(scale);
    const centred = {
        scale,
        x: (visible.width - tiles.width * tile) / 2,
        y: (visible.height - tiles.height * tile) / 2,
        following: true,
    };
    return placed(centred, tiles, visible);
}

export function zoomAt(
    view: View,
    scale: number,
    at: Point,
    tiles: Size,
    visible: Size,
    max = MAX_SCALE,
): View {
    const next = clampScale(scale, max);
    if (next === view.scale) return view;
    const artX = (at.x - view.x) / view.scale;
    const artY = (at.y - view.y) / view.scale;
    const moved = { scale: next, x: at.x - artX * next, y: at.y - artY * next, following: false };
    return placed(moved, tiles, visible);
}

export function pinchScale(
    startScale: number,
    startDistance: number,
    distance: number,
    max = MAX_SCALE,
): number {
    if (startDistance <= 0) return startScale;
    return clampScale(Math.round((startScale * distance) / startDistance), max);
}

/** A drag that moves nothing leaves the view as it was, still following. */
export function panBy(view: View, dx: number, dy: number, tiles: Size, visible: Size): View {
    const moved = placed({ ...view, x: view.x + dx, y: view.y + dy }, tiles, visible);
    if (moved.x === view.x && moved.y === view.y) return view;
    return { ...moved, following: false };
}

/** Refits while following; otherwise keeps the scale and the point at the middle still. */
export function resized(
    view: View,
    tiles: Size,
    before: Size,
    area: Size,
    visible: Size,
    narrow: boolean,
    max = MAX_SCALE,
): View {
    if (view.following) return fitted(tiles, area, visible, narrow, max);
    const shifted = {
        ...view,
        x: view.x + (visible.width - before.width) / 2,
        y: view.y + (visible.height - before.height) / 2,
    };
    return placed(shifted, tiles, visible);
}

/** Moves the view the least it takes to bring a tile fully into it. */
export function revealed(view: View, at: GridPosition, tiles: Size, visible: Size): View {
    const tile = tilePx(view.scale);
    const axis = (offset: number, index: number, viewPx: number) => {
        const start = offset + index * tile;
        if (start < 0) return offset - start;
        if (start + tile > viewPx) return offset - (start + tile - viewPx);
        return offset;
    };
    const x = axis(view.x, at.x, visible.width);
    const y = axis(view.y, at.y, visible.height);
    if (x === view.x && y === view.y) return view;
    return placed({ ...view, x, y }, tiles, visible);
}

export function tileAt(view: View, tiles: Size, at: Point): GridPosition | null {
    const tile = tilePx(view.scale);
    const x = Math.floor((at.x - view.x) / tile);
    const y = Math.floor((at.y - view.y) / tile);
    return x >= 0 && y >= 0 && x < tiles.width && y < tiles.height ? { x, y } : null;
}

export function viewReducer(state: Viewport, action: ViewAction): Viewport {
    const { tiles, frame, view } = state;
    if (action.type === "frame") {
        const next = action.frame;
        const base =
            view === null || frame === null
                ? fitted(tiles, next.area, next.visible, next.narrow, next.maxScale)
                : resized(
                      view,
                      tiles,
                      frame.visible,
                      next.area,
                      next.visible,
                      next.narrow,
                      next.maxScale,
                  );
        const kept = action.keep === null ? base : revealed(base, action.keep, tiles, next.visible);
        return { tiles, frame: next, view: kept };
    }
    if (view === null || frame === null) return state;
    const { visible, maxScale } = frame;
    const middle = { x: visible.width / 2, y: visible.height / 2 };
    switch (action.type) {
        case "zoom":
            return {
                ...state,
                view: zoomAt(
                    view,
                    view.scale + action.steps,
                    action.at ?? middle,
                    tiles,
                    visible,
                    maxScale,
                ),
            };
        case "pinch":
            return {
                ...state,
                view: zoomAt(view, action.scale, action.at, tiles, visible, maxScale),
            };
        case "pan":
            return { ...state, view: panBy(view, action.dx, action.dy, tiles, visible) };
        case "fit":
            return { ...state, view: fitted(tiles, frame.area, visible, frame.narrow, maxScale) };
    }
}

/**
 * The browser's exact device pixel count where it has one that fits the ratio, since rounding
 * the CSS size can be a pixel off and stretch one column; otherwise the CSS size times the ratio.
 */
export function deviceSize(css: Size, ratio: number, exact: Size | null): Size {
    const worked = { width: Math.round(css.width * ratio), height: Math.round(css.height * ratio) };
    if (exact === null) return worked;
    const agrees =
        Math.abs(exact.width - worked.width) <= 1 && Math.abs(exact.height - worked.height) <= 1;
    return agrees ? exact : worked;
}
