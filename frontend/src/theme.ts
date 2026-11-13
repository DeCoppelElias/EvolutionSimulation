export type Theme = "light" | "dark";
export const THEME_KEY = "humansimulation.theme";

export function storedTheme(raw: string | null): Theme | null {
    return raw === "light" || raw === "dark" ? raw : null;
}

export function shownTheme(stored: Theme | null, systemDark: boolean): Theme {
    return stored ?? (systemDark ? "dark" : "light");
}

export function flipped(shown: Theme): Theme {
    return shown === "dark" ? "light" : "dark";
}
