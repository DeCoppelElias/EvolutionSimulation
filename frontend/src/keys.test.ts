import { describe, expect, test } from "vitest";
import { actionFor, isTyping, type KeyPress } from "./keys";

const key = (k: string, extra: Partial<KeyPress> = {}) =>
    actionFor({ key: k, ctrl: false, alt: false, meta: false, typing: false, ...extra });

describe("the keys", () => {
    test("map to the entry's actions", () => {
        expect(key(" ")).toBe("playPause");
        expect(key("i")).toBe("inspect");
        expect(key("I")).toBe("inspect");
        expect(key("h")).toBe("hand");
        expect(key("H")).toBe("hand");
        expect(key("p")).toBe("place");
        expect(key("P")).toBe("place");
        expect(key("+")).toBe("zoomIn");
        expect(key("=")).toBe("zoomIn");
        expect(key("-")).toBe("zoomOut");
        expect(key("0")).toBe("fit");
        expect(key(".")).toBe("step");
        expect(key("Escape")).toBe("escape");
    });

    test("leave every other key alone", () => {
        expect(key("1")).toBeNull();
        expect(key("a")).toBeNull();
    });

    test("do nothing with a modifier held, so the browser keeps Ctrl+plus, Ctrl+0 and Ctrl+P", () => {
        expect(key("+", { ctrl: true })).toBeNull();
        expect(key("0", { meta: true })).toBeNull();
        expect(key("p", { alt: true })).toBeNull();
    });

    test("do nothing while typing, so Space in the seed field types a space", () => {
        expect(key(" ", { typing: true })).toBeNull();
        expect(key("Escape", { typing: true })).toBeNull();
    });

    test("typing means a field or editable text has focus", () => {
        expect(isTyping("INPUT", "text", false)).toBe(true);
        expect(isTyping("INPUT", "number", false)).toBe(true);
        expect(isTyping("SELECT", "", false)).toBe(true);
        expect(isTyping("TEXTAREA", "", false)).toBe(true);
        expect(isTyping("DIV", "", true)).toBe(true);
        expect(isTyping("BUTTON", "", false)).toBe(false);
    });

    test("a slider or a checkbox with focus is not typing, so Space still plays", () => {
        expect(isTyping("INPUT", "range", false)).toBe(false);
        expect(isTyping("INPUT", "checkbox", false)).toBe(false);
    });
});
