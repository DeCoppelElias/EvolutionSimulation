import { useState } from "react";
import type { Api } from "./api";
import { messageOf } from "./messages";
import { readSeed } from "./seed";
import { defaultSpecies } from "./species";
import { populate, STARTING_RABBITS } from "./start";
import type { ThemeControl } from "./useTheme";

type Props = {
    api: Api;
    id: string;
    seed: number;
    species: string[];
    theme: ThemeControl;
    onError(message: string): void;
    onLeave(): void;
};

export function WorldPanel({ api, id, seed, species, theme, onError, onLeave }: Props) {
    const [busy, setBusy] = useState(false);
    const [spawnAs, setSpawnAs] = useState<string | null>(null);
    const [count, setCount] = useState(String(STARTING_RABBITS));
    const [seedText, setSeedText] = useState("");
    const [confirming, setConfirming] = useState(false);
    const chosen =
        spawnAs !== null && species.includes(spawnAs) ? spawnAs : defaultSpecies(species);

    const run = async (action: () => Promise<unknown>) => {
        setBusy(true);
        try {
            await action();
        } catch (error) {
            onError(messageOf(error));
        } finally {
            setBusy(false);
        }
    };

    const reset = () =>
        run(async () => {
            const read = readSeed(seedText);
            if (read.kind === "invalid") throw new Error(read.reason);
            await api.command(
                id,
                read.kind === "seed" ? { type: "reset", seed: read.seed } : { type: "reset" },
            );
            await populate(api, id);
        });

    return (
        <div className="world-panel">
            <div className="row">
                <span className="label">Seed</span>
                <span className="value">{seed}</span>
                <button
                    className="btn"
                    onClick={() =>
                        void navigator.clipboard
                            .writeText(String(seed))
                            .catch((error: unknown) => onError(messageOf(error)))
                    }
                >
                    Copy
                </button>
            </div>
            <div className="row">
                <span className="label">Spawn</span>
                <select
                    aria-label="Species to spawn"
                    disabled={busy}
                    value={chosen ?? ""}
                    onChange={(event) => setSpawnAs(event.target.value)}
                >
                    {species.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                <input
                    className="count"
                    type="number"
                    min={1}
                    aria-label="How many to spawn"
                    value={count}
                    onChange={(event) => setCount(event.target.value)}
                />
                <button
                    className="btn"
                    disabled={busy || chosen === null}
                    onClick={() => {
                        const many = Number(count);
                        if (!Number.isInteger(many) || many < 1) {
                            onError("spawn a whole number of creatures, at least 1");
                        } else if (chosen !== null) {
                            void run(() =>
                                api.command(id, {
                                    type: "spawn",
                                    species: chosen,
                                    count: Number(count),
                                }),
                            );
                        }
                    }}
                >
                    Spawn
                </button>
            </div>
            <div className="row">
                <span className="label">Reset</span>
                <input
                    aria-label="Seed for the reset"
                    placeholder="same seed"
                    value={seedText}
                    onChange={(event) => setSeedText(event.target.value)}
                />
                <button className="btn" disabled={busy} onClick={() => void reset()}>
                    Reset
                </button>
            </div>
            <div className="row">
                <button
                    className="btn"
                    disabled={busy}
                    onClick={() => void run(() => api.resetCensus(id))}
                >
                    Reset statistics
                </button>
            </div>
            {theme.stored !== null && (
                <p className="hint">
                    Theme: {theme.stored}, chosen here.{" "}
                    <button className="link" onClick={theme.follow}>
                        Follow the system
                    </button>
                </p>
            )}
            <div className="row danger-row">
                {confirming ? (
                    <>
                        <span>Delete this world?</span>
                        <button
                            className="btn danger"
                            disabled={busy}
                            onClick={() =>
                                void run(async () => {
                                    await api.deleteWorld(id);
                                    onLeave();
                                })
                            }
                        >
                            Yes
                        </button>
                        <button className="btn" onClick={() => setConfirming(false)}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button className="btn danger" onClick={() => setConfirming(true)}>
                        Delete world…
                    </button>
                )}
            </div>
        </div>
    );
}
