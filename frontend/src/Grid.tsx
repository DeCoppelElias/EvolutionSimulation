import { useEffect, useRef, useState, type PointerEvent } from "react";
import { isClick, moved, pressed, type Press } from "./gesture";
import { messageOf } from "./messages";
import { Scene } from "./scene";
import type { GeneRanges, GridPosition, PlayState, WorldSnapshot } from "./types";
import { pinchScale, tileAt, type Point, type Size, type View, type ViewAction } from "./viewport";

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
    onArea(area: Size): void;
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
    const latest = useRef({ props, area });
    useEffect(() => {
        latest.current = { props, area };
    });
    const pointers = useRef(new Map<number, Point>());
    const press = useRef<Press | null>(null);
    const pinch = useRef<Pinch | null>(null);
    const [grabbing, setGrabbing] = useState(false);

    useEffect(() => {
        const element = host.current;
        if (element === null) return;
        const observer = new ResizeObserver(([entry]) => {
            const next = {
                width: Math.floor(entry.contentRect.width),
                height: Math.floor(entry.contentRect.height),
            };
            setArea((current) =>
                current !== null && current.width === next.width && current.height === next.height
                    ? current
                    : next,
            );
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (area !== null) latest.current.props.onArea(area);
    }, [area]);

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
        if (ghost === null) scene.current?.setGhost(null, null);
    }, [ghost]);

    useEffect(() => {
        const element = host.current;
        if (element === null) return;
        const wheel = (event: WheelEvent) => {
            event.preventDefault();
            const box = element.getBoundingClientRect();
            latest.current.props.onView({
                type: "zoom",
                steps: event.deltaY < 0 ? 1 : -1,
                at: { x: event.clientX - box.left, y: event.clientY - box.top },
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
        view === null ? null : tileAt(view, { width, height }, point);
    const hover = (event: PointerEvent<HTMLDivElement>, point: Point) => {
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
                scale: pinchScale(started.scale, started.distance, distance(a, b)),
                at: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
            });
            return;
        }
        if (press.current === null) return;
        press.current = moved(press.current, point.x, point.y);
        if (!isClick(press.current)) {
            setGrabbing(true);
            props.onView({ type: "pan", dx: point.x - last.x, dy: point.y - last.y });
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
            onPointerLeave={() => scene.current?.setGhost(null, null)}
            onContextMenu={(event) => {
                if (ghost !== null || hand) event.preventDefault();
            }}
        />
    );
}
