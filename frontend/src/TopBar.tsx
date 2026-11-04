import { useEffect, useRef, useState } from "react";
import { FAST_FORWARD_DEFAULT, FAST_FORWARD_MAX } from "./fastForward";
import {
    FastForwardIcon,
    MenuIcon,
    MoonIcon,
    PauseIcon,
    PlayIcon,
    StepIcon,
    SunIcon,
} from "./icons";
import { PANELS, type Panel } from "./panels";
import type { PlayState } from "./types";
import type { ThemeControl } from "./useTheme";

const RATES = [0.5, 1, 2, 5, 10];

type Props = {
    day: number;
    play: PlayState;
    busy: boolean;
    /** The tile's size on screen, which is what the zoom reads as. */
    zoom: string | null;
    panel: Panel | null;
    theme: ThemeControl;
    folded: boolean;
    onLeave(): void;
    onStep(): void;
    onPlayPause(): void;
    onRate(daysPerSecond: number): void;
    onFastForward(days: number): void;
    onZoom(steps: number): void;
    onFit(): void;
    onPanel(panel: Panel): void;
    onMeasure(width: number): void;
};

export function TopBar(props: Props) {
    const { day, play, busy, zoom, panel, theme, folded } = props;
    const [days, setDays] = useState(String(FAST_FORWARD_DEFAULT));
    const [menuOpen, setMenuOpen] = useState(false);
    const menuWrap = useRef<HTMLSpanElement>(null);
    if (!folded && menuOpen) setMenuOpen(false);
    useEffect(() => {
        if (!menuOpen) return;
        const outside = (event: PointerEvent) => {
            if (!menuWrap.current?.contains(event.target as Node)) setMenuOpen(false);
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("pointerdown", outside);
        window.addEventListener("keydown", escape, true);
        return () => {
            window.removeEventListener("pointerdown", outside);
            window.removeEventListener("keydown", escape, true);
        };
    }, [menuOpen]);
    const measure = useRef<HTMLDivElement>(null);
    const onMeasure = useRef(props.onMeasure);
    useEffect(() => {
        onMeasure.current = props.onMeasure;
    });
    useEffect(() => {
        const element = measure.current;
        if (element === null) return;
        const observer = new ResizeObserver(() =>
            onMeasure.current(Math.ceil(element.getBoundingClientRect().width)),
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const rates = RATES.includes(play.daysPerSecond)
        ? RATES
        : [...RATES, play.daysPerSecond].sort((a, b) => a - b);
    const back = (
        <button className="ui" onClick={props.onLeave}>
            ‹ Worlds
        </button>
    );
    const left = (
        <>
            <span className="day">
                <small>day</small>
                {day}
            </span>
            <button
                className="ui icon"
                disabled={busy}
                title={play.playing ? "Pause (Space)" : "Play (Space)"}
                aria-label={play.playing ? "Pause" : "Play"}
                onClick={props.onPlayPause}
            >
                {play.playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
                className="ui icon"
                disabled={busy || play.playing}
                title="Step one day (.)"
                aria-label="Step one day"
                onClick={props.onStep}
            >
                <StepIcon />
            </button>
            <span className="group" role="group" aria-label="Days a second">
                {rates.map((rate) => (
                    <button
                        key={rate}
                        className="ui rate"
                        disabled={busy}
                        aria-pressed={play.daysPerSecond === rate}
                        onClick={() => props.onRate(rate)}
                    >
                        {rate === 0.5 ? "½" : rate}
                    </button>
                ))}
            </span>
        </>
    );
    const fastForward = (
        <span className="group">
            <input
                className="days"
                type="number"
                min={1}
                max={FAST_FORWARD_MAX}
                value={days}
                aria-label="Days to fast-forward"
                onChange={(event) => setDays(event.target.value)}
            />
            <button
                className="ui"
                disabled={busy}
                title="Fast-forward"
                onClick={() => props.onFastForward(Number(days))}
            >
                days <FastForwardIcon />
            </button>
        </span>
    );
    const zoomGroup = (
        <span className="group" role="group" aria-label="Zoom">
            <button
                className="ui icon"
                title="Zoom out (-)"
                aria-label="Zoom out"
                onClick={() => props.onZoom(-1)}
            >
                −
            </button>
            <span className="scale">{zoom ?? "–"}</span>
            <button
                className="ui icon"
                title="Zoom in (+)"
                aria-label="Zoom in"
                onClick={() => props.onZoom(1)}
            >
                +
            </button>
            <button className="ui" title="Fit the window (0)" onClick={props.onFit}>
                Fit
            </button>
        </span>
    );
    const themeButton = (
        <button
            className="ui icon"
            title={theme.shown === "dark" ? "Light theme" : "Dark theme"}
            aria-label={theme.shown === "dark" ? "Light theme" : "Dark theme"}
            onClick={theme.flip}
        >
            {theme.shown === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
    );
    const panels = (after: () => void) =>
        PANELS.map(({ key, name }) => (
            <button
                key={key}
                className="ui"
                aria-pressed={panel === key}
                onClick={() => {
                    props.onPanel(key);
                    after();
                }}
            >
                {name}
            </button>
        ));
    const right = (
        <>
            {zoomGroup}
            {themeButton}
            <span className="group" role="group" aria-label="Panels">
                {panels(() => undefined)}
            </span>
        </>
    );

    return (
        <header className="bar">
            <div className="bar-row">
                {!folded && back}
                {left}
                {!folded && fastForward}
                <span className="spacer" />
                {!folded && right}
                {folded && (
                    <span className="menu-wrap" ref={menuWrap}>
                        <button
                            className="ui icon"
                            aria-label="Menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            <MenuIcon />
                        </button>
                        {menuOpen && (
                            <div className="menu">
                                {back}
                                {zoomGroup}
                                {panels(() => setMenuOpen(false))}
                                {fastForward}
                                {themeButton}
                            </div>
                        )}
                    </span>
                )}
            </div>
            <div className="bar-row bar-measure" aria-hidden="true" inert ref={measure}>
                {back}
                {left}
                {fastForward}
                <span className="spacer" />
                {right}
            </div>
        </header>
    );
}
