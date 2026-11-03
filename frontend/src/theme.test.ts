import { describe, expect, test } from "vitest";
import { THEME_KEY, flipped, shownTheme, storedTheme } from "./theme";

describe("the theme", () => {
    test("follows the system with nothing stored", () => {
        expect(shownTheme(null, true)).toBe("dark");
        expect(shownTheme(null, false)).toBe("light");
    });

    test("a stored choice wins over the system", () => {
        expect(shownTheme("light", true)).toBe("light");
        expect(shownTheme("dark", false)).toBe("dark");
    });

    test("reads only light or dark from storage", () => {
        expect(storedTheme("dark")).toBe("dark");
        expect(storedTheme("purple")).toBeNull();
        expect(storedTheme(null)).toBeNull();
    });

    test("the button flips what is shown", () => {
        expect(flipped("dark")).toBe("light");
        expect(flipped("light")).toBe("dark");
    });

    test("is stored under one key", () => {
        expect(THEME_KEY).toBe("humansimulation.theme");
    });
});
