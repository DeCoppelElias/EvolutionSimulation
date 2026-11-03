import { useEffect, useMemo, useRef } from "react";
import { ghostLook } from "./looks";
import { rasterize } from "./pixels";

/** A species' standing sprite, or nothing for a species with no art. */
export function SpriteIcon({ spriteKey }: { spriteKey: string }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const look = useMemo(() => ghostLook(spriteKey), [spriteKey]);
    useEffect(() => {
        const element = canvas.current;
        if (element === null || look === null) return;
        const pixels = rasterize(look.grid, look.palette);
        element.width = pixels.width;
        element.height = pixels.height;
        element
            .getContext("2d")
            ?.putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0);
    }, [look]);
    if (look === null) return null;
    return <canvas ref={canvas} className="sprite-icon" aria-hidden="true" />;
}
