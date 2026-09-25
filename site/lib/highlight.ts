import { createHighlighter, type Highlighter } from "shiki";

/**
 * Colours code while the site is being built, never in the browser: the
 * reader is sent plain HTML with the colours already in it, and pays nothing
 * for them.
 *
 * One highlighter is created for the whole build — it loads a grammar and a
 * theme, which is slow enough to be worth doing once.
 */
let highlighter: Promise<Highlighter> | null = null;

function get(): Promise<Highlighter> {
  highlighter ??= createHighlighter({
    // Two themes, one file: the CSS variables below switch between them, so
    // the code follows the page instead of staying bright in the dark.
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "bash", "css", "json"],
  });
  return highlighter;
}

export type Language = "tsx" | "bash" | "css" | "json";

export async function highlight(code: string, lang: Language = "tsx"): Promise<string> {
  const shiki = await get();
  return shiki.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    // The class the stylesheet keys the dark colours off.
    defaultColor: false,
    cssVariablePrefix: "--code-",
  });
}
