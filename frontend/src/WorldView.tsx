import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { Api } from "./api";
import { Chart } from "./Chart";
import { CreatureTable } from "./CreatureTable";
import { Drawer } from "./Drawer";
import { fastForward } from "./fastForward";
import { Grid } from "./Grid";
import { afterClick, inspectTile, resolve, sightOf, type Picked } from "./inspect";
import { Inspector } from "./Inspector";
import { actionFor, isTyping } from "./keys";
import { layoutFor, visibleArea } from "./layout";
import { messageOf } from "./messages";
import { PANELS, afterInspect, pressedPanel, type Panel } from "./panels";
import { Rail } from "./Rail";
import { isNewRun } from "./run";
import { SettingsPanel } from "./SettingsPanel";
import { defaultSpecies } from "./species";
import { INSPECTING, choose, escapeStep, rightClicked, speciesChosen } from "./tools";
import { TopBar } from "./TopBar";
import type { CensusRow, EntityView, GeneRanges, PlayState, WorldSnapshot } from "./types";
import type { ThemeControl } from "./useTheme";
import { useWorld } from "./useWorld";
import { maxScaleFor, tileLabel, viewReducer, type Size } from "./viewport";
import { WorldPanel } from "./WorldPanel";

const PAGE_COLOUR = { light: "#e8ede6", dark: "#12161e" };

type Props = {
    api: Api;
    id: string;
    theme: ThemeControl;
    notice: ReactNode;
    onLeave(notice: string | null): void;
    onError(message: string): void;
};

export function WorldView({ api, id, theme, notice, onLeave, onError }: Props) {
    const { snapshot, play, history, gone } = useWorld(api, id);
    const [genes, setGenes] = useState<GeneRanges | null>(null);

    useEffect(() => {
        let current = true;
        api.genes(id).then(
            (ranges) => {
                if (current) setGenes(ranges);
            },
            (error: unknown) => {
                if (current) onError(`Markings are off: ${messageOf(error)}`);
            },
        );
        return () => {
            current = false;
        };
    }, [api, id, onError]);

    useEffect(() => {
        if (gone) {
            onLeave("That world is not on this server. Pick or create one.");
        }
    }, [gone, onLeave]);

    if (snapshot === null) {
        return <p className="connecting">Connecting…</p>;
    }
    return (
        <Workbench
            api={api}
            id={id}
            theme={theme}
            notice={notice}
            snapshot={snapshot}
            play={play}
            history={history}
            genes={genes}
            onLeave={onLeave}
            onError={onError}
        />
    );
}

type WorkbenchProps = Omit<Props, "onLeave"> & {
    snapshot: WorldSnapshot;
    play: PlayState;
    history: CensusRow[];
    genes: GeneRanges | null;
    onLeave(notice: string | null): void;
};

/** The world page once the first snapshot has come; its size never changes, since a reset keeps it. */
function Workbench(props: WorkbenchProps) {
    const { api, id, theme, notice, snapshot, play, history, genes, onLeave, onError } = props;
    const [tools, setTools] = useState(INSPECTING);
    const [placing, setPlacing] = useState<string | null>(null);
    const [panel, setPanel] = useState<Panel | null>(null);
    const [picked, setPicked] = useState<Picked | null>(null);
    const [tile, setTile] = useState<EntityView[]>([]);
    const [run, setRun] = useState(0);
    const [seen, setSeen] = useState<WorldSnapshot>(snapshot);
    const [busy, setBusy] = useState(false);
    const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
    const [barNeeds, setBarNeeds] = useState<number | null>(null);
    const [area, setArea] = useState<Size | null>(null);
    const [ratio, setRatio] = useState(1);
    const [viewport, dispatch] = useReducer(viewReducer, {
        tiles: { width: snapshot.width, height: snapshot.height },
        frame: null,
        view: null,
    });

    // A new run reuses ids, so whatever was picked belonged to the old one.
    if (snapshot !== seen) {
        if (isNewRun(seen, snapshot)) {
            setPicked(null);
            setTile([]);
            setRun((count) => count + 1);
        }
        setSeen(snapshot);
    }

    useEffect(() => {
        const resized = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", resized);
        return () => window.removeEventListener("resize", resized);
    }, []);

    const species = snapshot.species;
    const placeAs =
        placing !== null && species.includes(placing) ? placing : defaultSpecies(species);
    const resolved = resolve(snapshot, picked);
    const { narrow, folded } = layoutFor(windowWidth, barNeeds);
    const panelOpen = panel !== null;
    const keepAt = resolved.kind === "alive" ? resolved.at : null;
    const keep = useRef(keepAt);
    useEffect(() => {
        keep.current = keepAt;
    });

    useEffect(() => {
        if (area === null) return;
        dispatch({
            type: "frame",
            frame: {
                area,
                visible: visibleArea(area, narrow, panelOpen),
                narrow,
                maxScale: maxScaleFor(ratio),
            },
            keep: keep.current,
        });
    }, [area, ratio, narrow, panelOpen]);

    const act = async (action: () => Promise<unknown>) => {
        setBusy(true);
        try {
            await action();
        } catch (error) {
            onError(messageOf(error));
        } finally {
            setBusy(false);
        }
    };
    const playPause = () => {
        if (!busy) void act(() => (play.playing ? api.pause(id) : api.play(id)));
    };
    const step = () => {
        if (!busy && !play.playing) void act(() => api.step(id, 1));
    };

    const clickTile = (at: { x: number; y: number }) => {
        if (tools.tool === "inspect") {
            const click = inspectTile(snapshot, at);
            setTile(click.entities);
            setPicked(afterClick(picked, click));
            setPanel(afterInspect(panel, click.entities.length > 0));
        } else if (tools.tool === "place" && placeAs !== null) {
            void api
                .command(id, { type: "spawnAt", species: placeAs, at })
                .catch((error: unknown) => onError(messageOf(error)));
        }
    };

    const latest = useRef({ tools, panel, picked, playPause, step });
    useEffect(() => {
        latest.current = { tools, panel, picked, playPause, step };
    });
    useEffect(() => {
        const pressed = (event: KeyboardEvent) => {
            const target = event.target instanceof HTMLElement ? event.target : null;
            const action = actionFor({
                key: event.key,
                ctrl: event.ctrlKey,
                alt: event.altKey,
                meta: event.metaKey,
                typing:
                    target !== null &&
                    isTyping(
                        target.tagName,
                        target instanceof HTMLInputElement ? target.type : "",
                        target.isContentEditable,
                    ),
            });
            if (action === null) return;
            event.preventDefault();
            if (event.repeat && (action === "playPause" || action === "step")) return;
            const now = latest.current;
            switch (action) {
                case "playPause":
                    now.playPause();
                    break;
                case "step":
                    now.step();
                    break;
                case "inspect":
                    setTools((current) => choose(current, "inspect"));
                    break;
                case "hand":
                    setTools((current) => choose(current, "hand"));
                    break;
                case "place":
                    setTools((current) =>
                        current.tool === "place" ? current : choose(current, "place"),
                    );
                    break;
                case "zoomIn":
                    dispatch({ type: "zoom", steps: 1 });
                    break;
                case "zoomOut":
                    dispatch({ type: "zoom", steps: -1 });
                    break;
                case "fit":
                    dispatch({ type: "fit" });
                    break;
                case "escape": {
                    const next = escapeStep({
                        tools: now.tools,
                        panelOpen: now.panel !== null,
                        selected: now.picked !== null,
                    });
                    if (next === "closeList") setTools({ ...now.tools, listOpen: false });
                    if (next === "disarm") setTools(INSPECTING);
                    if (next === "closePanel") setPanel(null);
                    if (next === "clearSelection") {
                        setPicked(null);
                        setTile([]);
                    }
                    break;
                }
            }
        };
        window.addEventListener("keydown", pressed);
        return () => window.removeEventListener("keydown", pressed);
    }, []);

    const pick = (next: Picked) => {
        setPicked(next);
        setPanel("inspector");
    };
    const sight = useMemo(() => sightOf(snapshot, resolve(snapshot, picked)), [snapshot, picked]);
    const named = PANELS.find((entry) => entry.key === panel)?.name ?? "";
    const drawer = panel !== null && (
        <Drawer name={named} onClose={() => setPanel(null)}>
            {panel === "inspector" && (
                <Inspector resolved={resolved} tile={tile} genes={genes} onPick={setPicked} />
            )}
            {panel === "creatures" && (
                <CreatureTable
                    key={run}
                    snapshot={snapshot}
                    selected={picked?.id ?? null}
                    onPick={pick}
                />
            )}
            {panel === "population" && <Chart history={history} />}
            {panel === "settings" && (
                <SettingsPanel api={api} id={id} values={snapshot.settings} onError={onError} />
            )}
            {panel === "world" && (
                <WorldPanel
                    api={api}
                    id={id}
                    seed={snapshot.seed}
                    species={species}
                    theme={theme}
                    onError={onError}
                    onLeave={() => onLeave(null)}
                />
            )}
        </Drawer>
    );

    return (
        <div className={narrow ? "page narrow" : "page"}>
            <TopBar
                day={snapshot.day}
                play={play}
                busy={busy}
                zoom={viewport.view === null ? null : tileLabel(viewport.view.scale, ratio)}
                panel={panel}
                theme={theme}
                folded={folded}
                onLeave={() => onLeave(null)}
                onStep={step}
                onPlayPause={playPause}
                onRate={(rate) => void act(() => api.rate(id, rate))}
                onFastForward={(days) => void act(() => fastForward(api, id, days, play.playing))}
                onZoom={(steps) => dispatch({ type: "zoom", steps })}
                onFit={() => dispatch({ type: "fit" })}
                onPanel={(pressed) => setPanel(pressedPanel(panel, pressed))}
                onMeasure={setBarNeeds}
            />
            <div className="notice-slot">{notice}</div>
            <Rail
                tools={tools}
                species={species}
                placing={placeAs}
                onChoose={(tool) => setTools(choose(tools, tool))}
                onSpecies={(name) => {
                    setPlacing(name);
                    setTools(speciesChosen());
                }}
            />
            <div className="stage">
                <Grid
                    snapshot={snapshot}
                    play={play}
                    sight={sight}
                    genes={genes}
                    view={viewport.view}
                    ghost={tools.tool === "place" ? placeAs : null}
                    hand={tools.tool === "hand"}
                    background={PAGE_COLOUR[theme.shown]}
                    onArea={(measured, perCss) => {
                        setArea(measured);
                        setRatio(perCss);
                    }}
                    onView={dispatch}
                    onTileClick={clickTile}
                    onRightClick={() => setTools(rightClicked())}
                    onError={onError}
                />
                {narrow && drawer}
            </div>
            {!narrow && drawer}
        </div>
    );
}
