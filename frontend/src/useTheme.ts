import { useCallback, useEffect, useState } from "react";
import { THEME_KEY, flipped, shownTheme, storedTheme, type Theme } from "./theme";

const DARK = "(prefers-color-scheme: dark)";

export type ThemeControl = { shown: Theme; stored: Theme | null; flip(): void; follow(): void };

/** The page's theme on the root element, following the system until the button stores a choice. */
export function useTheme(): ThemeControl {
    const [stored, setStored] = useState(() => storedTheme(localStorage.getItem(THEME_KEY)));
    const [systemDark, setSystemDark] = useState(() => matchMedia(DARK).matches);
    useEffect(() => {
        const query = matchMedia(DARK);
        const changed = () => setSystemDark(query.matches);
        query.addEventListener("change", changed);
        return () => query.removeEventListener("change", changed);
    }, []);
    const shown = shownTheme(stored, systemDark);
    useEffect(() => {
        document.documentElement.dataset.theme = shown;
    }, [shown]);
    const flip = useCallback(() => {
        const next = flipped(shown);
        localStorage.setItem(THEME_KEY, next);
        setStored(next);
    }, [shown]);
    const follow = useCallback(() => {
        localStorage.removeItem(THEME_KEY);
        setStored(null);
    }, []);
    return { shown, stored, flip, follow };
}
