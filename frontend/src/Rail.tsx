import { SpriteIcon } from "./SpriteIcon";
import type { Tool, Tools } from "./tools";

type Props = {
    tools: Tools;
    species: string[];
    placing: string | null;
    onChoose(tool: Tool): void;
    onSpecies(name: string): void;
};

export function Rail({ tools, species, placing, onChoose, onSpecies }: Props) {
    return (
        <nav className="rail" aria-label="Tools">
            <button
                className="ui tool"
                title="Inspect (I)"
                aria-label="Inspect"
                aria-pressed={tools.tool === "inspect"}
                onClick={() => onChoose("inspect")}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <circle
                        cx="8"
                        cy="8"
                        r="5.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M12 12l5 5"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
            <button
                className="ui tool"
                title="Move around (H)"
                aria-label="Move around"
                aria-pressed={tools.tool === "hand"}
                onClick={() => onChoose("hand")}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                        d="M5 11V6.5a1.5 1.5 0 0 1 3 0V10V4.5a1.5 1.5 0 0 1 3 0V10V5.5a1.5 1.5 0 0 1 3 0V11a6 6 0 0 1-6 6h-.5A4.5 4.5 0 0 1 3 12.5v-1a1.5 1.5 0 0 1 2-1.4"
                        fill="currentColor"
                    />
                </svg>
            </button>
            <span className="place-wrap">
                <button
                    className="ui tool"
                    title={`Place (P), now: ${placing ?? "nothing"}`}
                    aria-label="Place"
                    aria-haspopup="listbox"
                    aria-expanded={tools.listOpen}
                    aria-pressed={tools.tool === "place"}
                    onClick={() => onChoose("place")}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        fill="currentColor"
                    >
                        <ellipse cx="10" cy="13.5" rx="4.5" ry="3.8" />
                        <circle cx="4.5" cy="8" r="2" />
                        <circle cx="8" cy="4.5" r="2" />
                        <circle cx="12" cy="4.5" r="2" />
                        <circle cx="15.5" cy="8" r="2" />
                    </svg>
                </button>
                {tools.listOpen && (
                    <div className="species-list" role="listbox" aria-label="Species to place">
                        {species.map((name) => (
                            <button
                                key={name}
                                className="ui"
                                role="option"
                                aria-selected={name === placing}
                                aria-pressed={name === placing}
                                onClick={() => onSpecies(name)}
                            >
                                <SpriteIcon spriteKey={name} />
                                {name[0].toUpperCase() + name.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </span>
        </nav>
    );
}
