import { useEffect, useRef, useState, type PointerEvent } from "react";
import { isClick, moved, pressed, wheeled, type Press } from "./gesture";
import { messageOf } from "./messages";
import { Scene } from "./scene";
import type { GeneRanges, GridPosition, PlayState, WorldSnapshot } from "./types";
import {
    deviceSize,
    maxScaleFor,
    pinchScale,
    tileAt,
    type Point,
    type Size,
    type View,
    type ViewAction,
} from "./viewport";

type Props = {
    snapshot: WorldSnapshot;
    play: PlayState;
    sight: GridPosition[];
    genes: GeneRanges | null;
    view: View | null;
    /** The species Place would put down, or null when Place is not armed. */
    ghost: string | null;
    hand: boolean;
    background: string;
    /** The canvas in device pixels, and device pixels per CSS pixel. */
    onArea(area: Size, ratio: number): void;
    onView(action: ViewAction): void;
    onTileClick(at: GridPosition): void;
    onRightClick(): void;
    onError(message: string): void;
};

type Pinch = { scale: number; distance: number };

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export function Grid(props: Props) {
    const { snapshot, sight, genes, view, ghost, hand, background } = props;
    const { width, height } = snapshot;
    const host = useRef<HTMLDivElement>(null);
    const scene = useRef<Scene | null>(null);
    const [area, setArea] = useState<Size | null>(null);
    const [ratio, setRatio] = useState(() => window.devicePixelRatio || 1);
    const latest = useRef({ props, area });
    useEffect(() => {
        latest.current = { props, area };
    });
    const pointers = useRef(new Map<number, Point>());
    const press = useRef<Press | null>(null);
    const pinch = useRef<Pinch | null>(null);
    const [grabbing, setGrabbing] = useState(false);
    const mouse = useRef<Point | null>(null);
    /** A point in CSS pixels from the grid's corner, in the device pixels the view works in. */
    const device = (point: Point): Point => {
        const element = host.current;
        const measured = latest.current.area;
        const across = element?.getBoundingClientRect().width ?? 0;
        const factor = measured === null || across === 0 ? 1 : measured.width / across;
        return { x: point.x * factor, y: point.y * factor };
    };

    useEffect(() => {
        const element = host.current;
        if (element === null) return;
        // Device pixels as the browser lays them out, so the canvas is shown 1:1 and never stretched.
        const observer = new ResizeObserver(([entry]) => {
            const exact = entry.devicePixelContentBoxSize?.[0];
            const scale = window.devicePixelRatio || 1;
            const next = deviceSize(
                { width: entry.contentRect.width, height: entry.contentRect.height },
                scale,
                exact === undefined ? null : { width: exact.inlineSize, height: exact.blockSize },
            );
            setRatio(scale);
            setArea((current) =>
                current !== null && current.width === next.width && current.height === next.height
                    ? current
                    : next,
            );
        });
        try {
            observer.observe(element, { box: "device-pixel-content-box" });
        } catch {
            observer.observe(element);
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (area !== null) latest.current.props.onArea(area, ratio);
    }, [area, ratio]);

    const measured = area !== null;
    useEffect(() => {
        const element = host.current;
        const first = latest.current.area;
        if (element === null || first === null) return;
        let cancelled = false;
        let created: Scene | null = null;
        const { props: now } = latest.current;
        Scene.create(element, width, height, first, now.background, (message) =>
            latest.current.props.onError(message),
        ).then(
            (made) => {
                if (cancelled) {
                    made.destroy();
                    return;
                }
                const current = latest.current.props;
                created = made;
                scene.current = made;
                if (latest.current.area !== null) made.setArea(latest.current.area);
                if (current.view !== null) made.setView(current.view);
                made.setGenes(current.genes);
                made.show(current.snapshot, current.play);
                made.showSight(current.sight);
                made.setBackground(current.background);
            },
            (error: unknown) => {
                if (!cancelled) {
                    latest.current.props.onError(
                        `The grid could not be drawn: ${messageOf(error)}`,
                    );
                }
            },
        );
        return () => {
            cancelled = true;
            created?.destroy();
            scene.current = null;
        };
    }, [width, height, measured]);

    useEffect(() => {
        scene.current?.show(snapshot, latest.current.props.play);
    }, [snapshot]);

    useEffect(() => {
        scene.current?.showSight(sight);
    }, [sight]);

    useEffect(() => {
        scene.current?.setGenes(genes);
    }, [genes]);

    useEffect(() => {
        if (area !== null) scene.current?.setArea(area);
    }, [area]);

    useEffect(() => {
        if (view !== null) scene.current?.setView(view);
    }, [view]);

    useEffect(() => {
        scene.current?.setBackground(background);
    }, [background]);

    useEffect(() => {
        const at = mouse.current;
        const shown =
            ghost !== null && at !== null && view !== null
                ? tileAt(view, { width, height }, device(at))
                : null;
        scene.current?.setGhost(shown, ghost);
    }, [ghost, view, width, height]);

    useEffect(() => {
        const element = host.current;
        if (element === null) return;
        let left = 0;
        const wheel = (event: WheelEvent) => {
            if (event.ctrlKey) return;
            event.preventDefault();
            const turned = wheeled(left, event.deltaY, event.deltaMode);
            left = turned.left;
            if (turned.steps === 0) return;
            const box = element.getBoundingClientRect();
            latest.current.props.onView({
                type: "zoom",
                steps: turned.steps,
                at: device({ x: event.clientX - box.left, y: event.clientY - box.top }),
            });
        };
        element.addEventListener("wheel", wheel, { passive: false });
        return () => element.removeEventListener("wheel", wheel);
    }, []);

    const pointAt = (event: PointerEvent<HTMLDivElement>): Point => {
        const box = event.currentTarget.getBoundingClientRect();
        return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const tileUnder = (point: Point): GridPosition | null =>
        view === null ? null : tileAt(view, { width, height }, device(point));
    const hover = (event: PointerEvent<HTMLDivElement>, point: Point) => {
        mouse.current = event.pointerType === "mouse" ? point : null;
        const shown = event.pointerType === "mouse" && ghost !== null ? tileUnder(point) : null;
        scene.current?.setGhost(shown, ghost);
    };

    const down = (event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        const point = pointAt(event);
        pointers.current.set(event.pointerId, point);
        if (pointers.current.size === 1) {
            press.current = pressed(point.x, point.y);
            pinch.current = null;
        } else if (pointers.current.size === 2 && view !== null) {
            const [a, b] = [...pointers.current.values()];
            press.current = null;
            pinch.current = { scale: view.scale, distance: distance(a, b) };
        }
    };

    const move = (event: PointerEvent<HTMLDivElement>) => {
        const point = pointAt(event);
        hover(event, point);
        const last = pointers.current.get(event.pointerId);
        if (last === undefined) return;
        pointers.current.set(event.pointerId, point);
        const started = pinch.current;
        if (started !== null && pointers.current.size >= 2) {
            const [a, b] = [...pointers.current.values()];
            props.onView({
                type: "pinch",
                scale: pinchScale(
                    started.scale,
                    started.distance,
                    distance(a, b),
                    maxScaleFor(ratio),
                ),
                at: device({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }),
            });
            return;
        }
        if (press.current === null) return;
        press.current = moved(press.current, point.x, point.y);
        if (!isClick(press.current)) {
            setGrabbing(true);
            const step = device({ x: point.x - last.x, y: point.y - last.y });
            props.onView({ type: "pan", dx: step.x, dy: step.y });
        }
    };

    const up = (event: PointerEvent<HTMLDivElement>) => {
        const was = press.current;
        pointers.current.delete(event.pointerId);
        if (pointers.current.size > 0) return;
        press.current = null;
        pinch.current = null;
        setGrabbing(false);
        if (was === null || !isClick(was)) return;
        if (event.button === 2) {
            props.onRightClick();
            return;
        }
        const at = tileUnder(pointAt(event));
        if (event.button === 0 && at !== null) props.onTileClick(at);
    };

    const cancel = (event: PointerEvent<HTMLDivElement>) => {
        pointers.current.delete(event.pointerId);
        press.current = null;
        pinch.current = null;
        setGrabbing(false);
    };

    return (
        <div
            ref={host}
            className="grid"
            style={{ cursor: grabbing ? "grabbing" : hand ? "grab" : "default" }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={cancel}
            onLostPointerCapture={cancel}
            onPointerLeave={() => {
                mouse.current = null;
                scene.current?.setGhost(null, null);
            }}
            onContextMenu={(event) => {
                if (ghost !== null || hand) event.preventDefault();
            }}
        />
    );
}
