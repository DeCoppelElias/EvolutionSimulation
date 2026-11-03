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
