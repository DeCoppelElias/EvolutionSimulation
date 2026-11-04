import { Fragment } from "react";
import { formatValue, goneMessage, label, type Picked, type Resolved } from "./inspect";
import { creatureLook } from "./looks";
import { LookIcon } from "./SpriteIcon";
import type { EntityView, GeneRanges } from "./types";

type Props = {
    resolved: Resolved;
    tile: EntityView[];
    genes: GeneRanges | null;
    onPick(picked: Picked): void;
};

export function Inspector({ resolved, tile, genes, onPick }: Props) {
    return (
        <section className="inspector">
            {tile.length > 1 && (
                <ul className="tile-list">
                    {tile.map((entity) => (
                        <li key={entity.id}>
                            <button
                                onClick={() => onPick({ id: entity.id, species: entity.species })}
                            >
                                {entity.species} {entity.id}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {resolved.kind === "none" && tile.length <= 1 && (
                <p className="hint">Click a creature to inspect it.</p>
            )}
            {resolved.kind === "gone" && <p>{goneMessage(resolved.picked)}</p>}
            {resolved.kind === "alive" && <Details entity={resolved.entity} genes={genes} />}
        </section>
    );
}

function Details({ entity, genes }: { entity: EntityView; genes: GeneRanges | null }) {
    return (
        <div>
            <div className="portrait">
                <LookIcon look={creatureLook(entity, genes)} scale={3} className="portrait-art" />
                <h3>
                    {entity.species} {entity.id}
                </h3>
            </div>
            <Values values={entity.info} named={label} />
            {Object.keys(entity.genes).length > 0 && (
                <>
                    <h4>Genes</h4>
                    <Values values={entity.genes} named={(key) => key} />
                </>
            )}
        </div>
    );
}

function Values({ values, named }: { values: Record<string, number>; named(key: string): string }) {
    return (
        <dl>
            {Object.entries(values).map(([key, value]) => (
                <Fragment key={key}>
                    <dt>{named(key)}</dt>
                    <dd>{formatValue(value)}</dd>
                </Fragment>
            ))}
        </dl>
    );
}
