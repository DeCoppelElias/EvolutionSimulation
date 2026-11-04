import { useEffect, useMemo, useRef } from "react";
import { ghostLook, type Look } from "./looks";
import { rasterize } from "./pixels";

/** A species' standing sprite, or nothing for a species with no art. */
export function SpriteIcon({ spriteKey }: { spriteKey: string }) {
    const look = useMemo(() => ghostLook(spriteKey), [spriteKey]);
    return <LookIcon look={look} scale={2} className="sprite-icon" />;
}

type LookProps = { look: Look | null; scale: number; className: string };

/** A sprite drawn at a whole scale, redrawn only when its look's key changes. */
export function LookIcon({ look, scale, className }: LookProps) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const latest = useRef(look);
    useEffect(() => {
        latest.current = look;
    });
    const key = look?.key ?? null;
    useEffect(() => {
        const element = canvas.current;
        const shown = latest.current;
        if (element === null || shown === null) return;
        const pixels = rasterize(shown.grid, shown.palette);
        element.width = pixels.width;
        element.height = pixels.height;
        element.style.width = `${pixels.width * scale}px`;
        element.style.height = `${pixels.height * scale}px`;
        element
            .getContext("2d")
            ?.putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0);
    }, [key, scale]);
    if (look === null) return null;
    return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
