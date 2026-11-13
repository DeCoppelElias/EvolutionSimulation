export const DRAG_PX = 4;

export type Press = { startX: number; startY: number; dragging: boolean };

export function pressed(x: number, y: number): Press {
    return { startX: x, startY: y, dragging: false };
}

/** A press becomes a drag once it strays DRAG_PX from where it started, and stays one. */
export function moved(press: Press, x: number, y: number): Press {
    if (press.dragging) return press;
    const far = Math.hypot(x - press.startX, y - press.startY) >= DRAG_PX;
    return far ? { ...press, dragging: true } : press;
}

export function isClick(press: Press): boolean {
    return !press.dragging;
}

/** One mouse wheel notch, in pixels of scroll. */
export const NOTCH_PX = 100;
const PX_PER_LINE = NOTCH_PX / 3;

export type Wheeled = { steps: number; left: number };

/**
 * A zoom step from scroll added up since the last one, so a trackpad's stream of small events
 * steps once per notch's worth rather than once per event. Upwards zooms in.
 */
export function wheeled(left: number, deltaY: number, deltaMode: number): Wheeled {
    if (deltaY === 0) return { steps: 0, left };
    const px =
        deltaMode === 0 ? deltaY : deltaMode === 1 ? deltaY * PX_PER_LINE : deltaY * NOTCH_PX;
    const total = left + px;
    if (Math.abs(total) < NOTCH_PX) return { steps: 0, left: total };
    const sign = Math.sign(total);
    const rest = Math.abs(total) - NOTCH_PX < NOTCH_PX ? total - sign * NOTCH_PX : 0;
    return { steps: -sign, left: rest };
}
