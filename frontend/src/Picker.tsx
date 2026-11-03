import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Api } from "./api";
import { MoonIcon, SunIcon } from "./icons";
import { messageOf } from "./messages";
import { readSeed } from "./seed";
import { readSide } from "./size";
import { SpriteIcon } from "./SpriteIcon";
import { populate } from "./start";
import type { WorldSummary } from "./types";
import type { ThemeControl } from "./useTheme";

type Props = {
    api: Api;
    theme: ThemeControl;
    notice: ReactNode;
    onOpen(id: string): void;
    onError(message: string): void;
};

export function Picker({ api, theme, notice, onOpen, onError }: Props) {
    const [worlds, setWorlds] = useState<WorldSummary[]>([]);
    const [seedText, setSeedText] = useState("");
    const [widthText, setWidthText] = useState("20");
    const [heightText, setHeightText] = useState("20");
    const [creating, setCreating] = useState(false);

    const refresh = useCallback(() => {
        api.listWorlds().then(setWorlds, (error: unknown) => onError(messageOf(error)));
    }, [api, onError]);
    useEffect(refresh, [refresh]);

    const create = async () => {
        const seed = readSeed(seedText);
        const width = readSide(widthText, "width");
        const height = readSide(heightText, "height");
        for (const read of [seed, width, height]) {
            if (read.kind === "invalid") {
                onError(read.reason);
                return;
            }
        }
        if (width.kind !== "side" || height.kind !== "side") return;
        setCreating(true);
        try {
            const created = await api.createWorld(seed.kind === "seed" ? seed.seed : null, {
                width: width.side,
                height: height.side,
            });
            await populate(api, created.id);
            onOpen(created.id);
        } catch (error) {
            onError(messageOf(error));
        } finally {
            setCreating(false);
        }
    };

    const remove = async (id: string) => {
        try {
            await api.deleteWorld(id);
            refresh();
        } catch (error) {
            onError(messageOf(error));
        }
    };

    return (
        <div className="page picker-page">
            <header className="bar">
                <div className="bar-row">
                    <h1>Worlds</h1>
                    <span className="spacer" />
                    <button
                        className="ui icon"
                        title={theme.shown === "dark" ? "Light theme" : "Dark theme"}
                        aria-label={theme.shown === "dark" ? "Light theme" : "Dark theme"}
                        onClick={theme.flip}
                    >
                        {theme.shown === "dark" ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>
            </header>
            <div className="notice-slot">{notice}</div>
            <main className="picker">
                <form
                    className="card create"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void create();
                    }}
                >
                    <h2>New world</h2>
                    <label>
                        Seed
                        <input
                            value={seedText}
                            placeholder="from the clock"
                            onChange={(event) => setSeedText(event.target.value)}
                        />
                    </label>
                    <label>
                        Width
                        <input
                            className="side"
                            inputMode="numeric"
                            value={widthText}
                            onChange={(event) => setWidthText(event.target.value)}
                        />
                    </label>
                    <label>
                        Height
                        <input
                            className="side"
                            inputMode="numeric"
                            value={heightText}
                            onChange={(event) => setHeightText(event.target.value)}
                        />
                    </label>
                    <span className="hint">5 to 25 a side</span>
                    <button className="btn primary" type="submit" disabled={creating}>
                        Create
                    </button>
                </form>
                <ul className="cards">
                    {worlds.map((world) => (
                        <li key={world.id} className="card world-card">
                            <button className="open" onClick={() => onOpen(world.id)}>
                                <span className="title">
                                    <strong>
                                        {world.width} × {world.height}
                                    </strong>{" "}
                                    <span className="hint">
                                        seed {world.seed} · day {world.day}
                                    </span>
                                    {world.playing && <span className="badge">playing</span>}
                                </span>
                                <span className="counts">
                                    {Object.entries(world.population).length === 0
                                        ? "empty"
                                        : Object.entries(world.population).map(([name, count]) => (
                                              <span
                                                  key={name}
                                                  className="count"
                                                  title={name}
                                                  aria-label={`${count} ${name}`}
                                              >
                                                  <SpriteIcon spriteKey={name} />
                                                  {count}
                                              </span>
                                          ))}
                                </span>
                            </button>
                            <button className="btn quiet" onClick={() => void remove(world.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
