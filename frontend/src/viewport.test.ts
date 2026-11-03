import { describe, expect, test } from "vitest";
import {
    clampAxis,
    fitScale,
    fitted,
    panBy,
    pinchScale,
    resized,
    revealed,
    tileAt,
    viewReducer,
    zoomAt,
    type Viewport,
} from "./viewport";

const twenty = { width: 20, height: 20 };
const laptop = { width: 1318, height: 720 };
const drawerOpen = { width: 878, height: 720 };

describe("Fit", () => {
    test("is the largest whole scale that shows the whole world", () => {
        // 320 art pixels into 720: 2.25.
        expect(fitScale(twenty, laptop, false)).toBe(2);
    });

    test("on a narrow window is the smallest that fills its shorter side", () => {
        // 390 wide is the shorter side: 1.22 rounds up to 2.
        expect(fitScale(twenty, { width: 390, height: 700 }, true)).toBe(2);
        // The width is the shorter side, so it decides even though the height is tighter.
        expect(fitScale({ width: 10, height: 30 }, { width: 450, height: 700 }, true)).toBe(3);
    });

    test("lets a small world fill a large screen, up to 12", () => {
        expect(fitScale({ width: 5, height: 5 }, laptop, false)).toBe(9);
        expect(fitScale({ width: 5, height: 5 }, { width: 4000, height: 3000 }, false)).toBe(12);
    });

    test("never drops below 1", () => {
        expect(fitScale({ width: 25, height: 25 }, { width: 300, height: 300 }, false)).toBe(1);
    });

    test("centres the world and follows", () => {
        expect(fitted(twenty, laptop, laptop, false)).toEqual({
            scale: 2,
            x: 339,
            y: 40,
            following: true,
        });
    });
});

describe("an axis", () => {
    test("that fits stays centred whatever the offset", () => {
        expect(clampAxis(-500, 640, 720, 32)).toBe(40);
    });

    test("that overflows stops one tile past each edge", () => {
        expect(clampAxis(500, 960, 720, 48)).toBe(48);
        expect(clampAxis(-500, 960, 720, 48)).toBe(720 - 960 - 48);
        expect(clampAxis(-100, 960, 720, 48)).toBe(-100);
    });
});

describe("zooming", () => {
    const start = { scale: 2, x: 339, y: 40, following: true };

    test("keeps the point under the cursor still and stops following", () => {
        // The middle of the world, art pixel 160, sits at (659, 360) and stays there at 3x.
        expect(zoomAt(start, 3, { x: 659, y: 360 }, twenty, laptop)).toEqual({
            scale: 3,
            x: 179,
            y: -120,
            following: false,
        });
    });

    test("stays within 1 to 12", () => {
        const top = { ...start, scale: 12 };
        expect(zoomAt(top, 13, { x: 0, y: 0 }, twenty, laptop)).toBe(top);
    });

    test("by pinch rounds to a whole step", () => {
        expect(pinchScale(2, 100, 160)).toBe(3);
        expect(pinchScale(2, 100, 40)).toBe(1);
        expect(pinchScale(11, 100, 300)).toBe(12);
    });

    test("by pinch from two touches on one spot keeps the scale", () => {
        expect(pinchScale(3, 0, 0)).toBe(3);
        expect(pinchScale(3, 0, 50)).toBe(3);
    });
});

describe("panning", () => {
    const zoomed = { scale: 3, x: 179, y: -120, following: false };

    test("stops one tile past the edge, so a hop on the top row stays in view", () => {
        expect(panBy(zoomed, 0, 5000, twenty, laptop).y).toBe(48);
        expect(panBy(zoomed, 0, -5000, twenty, laptop).y).toBe(720 - 960 - 48);
    });

    test("with a sheet over the lower part stops against the part above it", () => {
        const aboveSheet = { width: 1318, height: 324 };
        expect(panBy(zoomed, 0, -5000, twenty, aboveSheet).y).toBe(324 - 960 - 48);
    });

    test("stops following", () => {
        expect(panBy({ ...zoomed, following: true }, 0, 1, twenty, laptop).following).toBe(false);
    });

    test("that moves nothing, on a world that fits, keeps following", () => {
        const view = fitted(twenty, laptop, laptop, false);
        expect(panBy(view, 6, 6, twenty, laptop)).toBe(view);
    });
});

describe("a change of area", () => {
    test("refits while following", () => {
        // 600 wide fits only 1x, so a refit drops a step where keeping the middle would not.
        const view = fitted(twenty, laptop, laptop, false);
        const narrower = { width: 600, height: 720 };
        expect(resized(view, twenty, laptop, narrower, narrower, false)).toEqual({
            scale: 1,
            x: 140,
            y: 200,
            following: true,
        });
    });

    test("keeps the scale and the middle point once the viewer has zoomed", () => {
        const zoomed = { scale: 3, x: 179, y: -120, following: false };
        // The middle moves 220 left, so the world does too.
        expect(resized(zoomed, twenty, laptop, drawerOpen, drawerOpen, false)).toEqual({
            scale: 3,
            x: -41,
            y: -120,
            following: false,
        });
    });
});

describe("keeping a tile in view", () => {
    const view = { scale: 3, x: -41, y: -120, following: false };

    test("moves the least it takes", () => {
        // Tile 19 at 3x spans 912 to 960 from the world's left, so at x = -41 it ends at 919.
        const next = revealed(view, { x: 19, y: 10 }, twenty, drawerOpen);
        expect(next.x).toBe(878 - 960);
        expect(next.y).toBe(-120);
    });

    test("leaves a tile already in view alone", () => {
        expect(revealed(view, { x: 5, y: 10 }, twenty, drawerOpen)).toBe(view);
    });
});

describe("a point on screen", () => {
    const view = { scale: 2, x: 339, y: 40, following: true };

    test("names the tile under it", () => {
        expect(tileAt(view, twenty, { x: 339, y: 40 })).toEqual({ x: 0, y: 0 });
        expect(tileAt(view, twenty, { x: 339 + 639, y: 40 + 31 })).toEqual({ x: 19, y: 0 });
    });

    test("outside the world names none", () => {
        expect(tileAt(view, twenty, { x: 338, y: 100 })).toBeNull();
        expect(tileAt(view, twenty, { x: 400, y: 40 + 640 })).toBeNull();
    });
});

describe("the view's reducer", () => {
    const empty: Viewport = { tiles: twenty, frame: null, view: null };
    const frame = { area: laptop, visible: laptop, narrow: false };
    const framed = viewReducer(empty, { type: "frame", frame, keep: null });

    test("fits on the first frame", () => {
        expect(framed.view).toEqual(fitted(twenty, laptop, laptop, false));
    });

    test("zooms by steps about the middle when no point is given", () => {
        expect(viewReducer(framed, { type: "zoom", steps: 1 }).view?.scale).toBe(3);
    });

    test("Fit hands control back", () => {
        const zoomed = viewReducer(framed, { type: "zoom", steps: 2 });
        expect(viewReducer(zoomed, { type: "fit" }).view).toEqual(framed.view);
    });

    test("a new frame keeps the selected tile in view", () => {
        const zoomed = viewReducer(framed, { type: "zoom", steps: 1, at: { x: 1300, y: 360 } });
        const opened = { area: drawerOpen, visible: drawerOpen, narrow: false };
        const after = viewReducer(zoomed, { type: "frame", frame: opened, keep: { x: 19, y: 10 } });
        expect(after.view?.x).toBe(878 - 960);
    });

    test("does nothing before the first frame", () => {
        expect(viewReducer(empty, { type: "zoom", steps: 1 })).toBe(empty);
    });
});
