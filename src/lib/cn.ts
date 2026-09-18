/**
 * Class name utility.
 *
 * Covers the two jobs component code always needs together:
 *
 *  1. Conditional joining — `cn("a", isActive && "b", { c: true })`
 *  2. Conflict resolution — later utilities win, so `cn("px-2", "px-4")`
 *     returns `"px-4"` rather than keeping both.
 *
 * Written from scratch: no `clsx`, no `tailwind-merge`.
 */

export type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: unknown };

/* -------------------------------------------------------------------------
 * 1. Joining
 * ---------------------------------------------------------------------- */

function pushWords(source: string, out: string[]): void {
  for (const word of source.split(/\s+/)) {
    if (word !== "") out.push(word);
  }
}

function collect(value: ClassValue, out: string[]): void {
  if (!value) return;

  if (typeof value === "string") {
    pushWords(value, out);
    return;
  }

  if (typeof value === "number" || typeof value === "bigint") {
    out.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collect(item, out);
    return;
  }

  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (value[key]) pushWords(key, out);
    }
  }
}

/* -------------------------------------------------------------------------
 * 2. Conflict groups
 *
 * Two utilities conflict when they set the same CSS property. Each class is
 * reduced to a group id; within one variant prefix, only the last class of a
 * group survives. A class with no known group never conflicts and is only
 * deduplicated against an identical copy.
 * ---------------------------------------------------------------------- */

type GroupResolver = string | ((match: RegExpMatchArray) => string);

interface Rule {
  readonly test: RegExp;
  readonly group: GroupResolver;
}

const SIDE = "(?:x|y|t|r|b|l|s|e)";
const CORNER = "(?:ss|se|es|ee|tl|tr|br|bl|t|r|b|l|s|e)";
const NUMERIC = "(?:\\d+(?:\\.\\d+)?|\\[[^\\]]*\\]|\\(--[^)]*\\))";

/** `text-[10px]` is a font size; `text-[#fff]` is a color. */
const ARBITRARY_LENGTH = /^\[(?:length:|calc|\d|\.\d)/;

const RULES: readonly Rule[] = [
  // --- layout ---------------------------------------------------------
  {
    test: /^(?:block|inline-block|inline-flex|inline-grid|inline-table|inline|flex|grid|table-cell|table-row|table|flow-root|contents|hidden|list-item)$/,
    group: "display",
  },
  { test: /^(?:static|fixed|absolute|relative|sticky)$/, group: "position" },
  { test: /^(?:visible|invisible|collapse)$/, group: "visibility" },
  { test: /^(?:sr-only|not-sr-only)$/, group: "sr" },
  { test: /^float-/, group: "float" },
  { test: /^clear-/, group: "clear" },
  { test: /^box-(?:border|content)$/, group: "box-sizing" },
  { test: /^-?inset-(x)-/, group: "inset-x" },
  { test: /^-?inset-(y)-/, group: "inset-y" },
  { test: /^-?inset-/, group: "inset" },
  { test: /^-?(top|right|bottom|left|start|end)-/, group: (m) => `pos-${m[1] ?? ""}` },
  { test: /^-?z-/, group: "z" },
  { test: /^-?order-/, group: "order" },
  { test: /^aspect-/, group: "aspect" },
  { test: /^overflow-(x|y)-/, group: (m) => `overflow-${m[1] ?? ""}` },
  { test: /^overflow-/, group: "overflow" },
  { test: /^object-(?:contain|cover|fill|none|scale-down)$/, group: "object-fit" },
  { test: /^object-/, group: "object-position" },
  { test: /^isolate$|^isolation-/, group: "isolation" },

  // --- flexbox & grid --------------------------------------------------
  { test: /^flex-(?:row|row-reverse|col|col-reverse)$/, group: "flex-direction" },
  { test: /^flex-(?:wrap|wrap-reverse|nowrap)$/, group: "flex-wrap" },
  { test: /^flex-/, group: "flex" },
  { test: /^basis-/, group: "basis" },
  { test: /^grow/, group: "grow" },
  { test: /^shrink/, group: "shrink" },
  { test: /^grid-cols-/, group: "grid-cols" },
  { test: /^grid-rows-/, group: "grid-rows" },
  { test: /^grid-flow-/, group: "grid-flow" },
  { test: /^-?col-(span|start|end)-/, group: (m) => `col-${m[1] ?? ""}` },
  { test: /^-?row-(span|start|end)-/, group: (m) => `row-${m[1] ?? ""}` },
  { test: /^auto-(?:cols|rows)-/, group: "auto-track" },
  { test: /^gap-(x|y)-/, group: (m) => `gap-${m[1] ?? ""}` },
  { test: /^gap-/, group: "gap" },
  { test: /^-?space-(x|y)-/, group: (m) => `space-${m[1] ?? ""}` },
  { test: /^justify-items-/, group: "justify-items" },
  { test: /^justify-self-/, group: "justify-self" },
  { test: /^justify-/, group: "justify" },
  { test: /^items-/, group: "items" },
  { test: /^content-(?:normal|center|start|end|between|around|evenly|baseline|stretch)$/, group: "align-content" },
  { test: /^self-/, group: "self" },
  { test: /^place-(content|items|self)-/, group: (m) => `place-${m[1] ?? ""}` },

  // --- spacing ---------------------------------------------------------
  { test: new RegExp(`^-?([mp])(${SIDE})?-`), group: (m) => `${m[1] ?? ""}${m[2] ?? ""}` },

  // --- sizing ----------------------------------------------------------
  { test: /^(min|max)-(w|h)-/, group: (m) => `${m[1] ?? ""}-${m[2] ?? ""}` },
  { test: /^w-/, group: "w" },
  { test: /^h-/, group: "h" },
  { test: /^size-/, group: "size" },

  // --- typography ------------------------------------------------------
  {
    test: /^font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    group: "font-weight",
  },
  { test: /^font-/, group: "font-family" },
  { test: /^text-(?:left|center|right|justify|start|end)$/, group: "text-align" },
  { test: /^text-(?:ellipsis|clip|wrap|nowrap|balance|pretty)$/, group: "text-overflow" },
  { test: /^text-(?:xs|sm|base|lg|\d*xl)(?:\/\S+)?$/, group: "font-size" },
  {
    test: /^text-(\[[^\]]*\])/,
    group: (m) => (ARBITRARY_LENGTH.test(m[1] ?? "") ? "font-size" : "text-color"),
  },
  { test: /^text-/, group: "text-color" },
  { test: /^leading-/, group: "leading" },
  { test: /^-?tracking-/, group: "tracking" },
  { test: /^(?:underline|overline|line-through|no-underline)$/, group: "text-decoration" },
  { test: /^decoration-/, group: "text-decoration-color" },
  { test: /^(?:uppercase|lowercase|capitalize|normal-case)$/, group: "text-transform" },
  { test: /^truncate$/, group: "text-overflow" },
  { test: /^whitespace-/, group: "whitespace" },
  { test: /^(?:break-|wrap-)/, group: "word-break" },
  { test: /^align-/, group: "vertical-align" },
  { test: /^list-(?:inside|outside)$/, group: "list-position" },
  { test: /^list-/, group: "list-style" },
  { test: /^-?indent-/, group: "indent" },
  { test: /^tabular-nums$|^slashed-zero$|^(?:normal|ordinal|lining|oldstyle|proportional|diagonal|stacked)-nums$/, group: "font-numeric" },

  // --- backgrounds -----------------------------------------------------
  { test: /^bg-(?:fixed|local|scroll)$/, group: "bg-attachment" },
  { test: /^bg-(?:auto|cover|contain)$/, group: "bg-size" },
  { test: /^bg-(?:repeat|no-repeat)/, group: "bg-repeat" },
  { test: /^bg-(?:none|gradient-|linear-|radial-|conic-)/, group: "bg-image" },
  { test: /^bg-(?:bottom|center|left|right|top)/, group: "bg-position" },
  { test: /^bg-clip-/, group: "bg-clip" },
  { test: /^bg-origin-/, group: "bg-origin" },
  { test: /^bg-/, group: "bg-color" },
  { test: /^(?:from|via|to)-/, group: (m) => `gradient-${m[0]?.split("-")[0] ?? ""}` },

  // --- borders ---------------------------------------------------------
  { test: new RegExp(`^rounded(-${CORNER})?(?:-|$)`), group: (m) => `rounded${m[1] ?? ""}` },
  { test: /^border-(?:solid|dashed|dotted|double|hidden|none)$/, group: "border-style" },
  { test: /^border-(?:collapse|separate)$/, group: "border-collapse" },
  { test: /^border-spacing-/, group: "border-spacing" },
  {
    test: new RegExp(`^border(-${SIDE})?(?:-${NUMERIC})?$`),
    group: (m) => `border-w${m[1] ?? ""}`,
  },
  { test: new RegExp(`^border(-${SIDE})?-`), group: (m) => `border-color${m[1] ?? ""}` },
  { test: /^divide-(x|y)/, group: (m) => `divide-${m[1] ?? ""}` },
  { test: /^divide-/, group: "divide-color" },
  { test: /^outline-offset-/, group: "outline-offset" },
  { test: /^outline-(?:none|hidden|dashed|dotted|double|solid)$/, group: "outline-style" },
  { test: new RegExp(`^outline(?:-${NUMERIC})?$`), group: "outline-w" },
  { test: /^outline-/, group: "outline-color" },
  { test: /^ring-offset-/, group: "ring-offset" },
  { test: /^ring-inset$/, group: "ring-inset" },
  { test: new RegExp(`^ring(?:-${NUMERIC})?$`), group: "ring-w" },
  { test: /^ring-/, group: "ring-color" },

  // --- effects ---------------------------------------------------------
  {
    test: /^(?:shadow|drop-shadow|inset-shadow)(?:-(?:2xs|xs|sm|md|lg|xl|2xl|inner|none|initial))?$|^shadow-\[/,
    group: "shadow",
  },
  { test: /^shadow-/, group: "shadow-color" },
  { test: /^opacity-/, group: "opacity" },
  { test: /^mix-blend-/, group: "mix-blend" },
  { test: /^bg-blend-/, group: "bg-blend" },

  // --- filters ---------------------------------------------------------
  { test: /^backdrop-([a-z-]+?)-/, group: (m) => `backdrop-${m[1] ?? ""}` },
  { test: /^(?:blur|brightness|contrast|grayscale|invert|saturate|sepia|hue-rotate)(?:-|$)/, group: (m) => `filter-${m[0]?.replace(/-.*$/, "") ?? ""}` },

  // --- tables ----------------------------------------------------------
  { test: /^table-(?:auto|fixed)$/, group: "table-layout" },
  { test: /^caption-/, group: "caption-side" },

  // --- transitions & animation -----------------------------------------
  { test: /^transition(?:-|$)/, group: "transition" },
  { test: /^duration-/, group: "duration" },
  { test: /^ease-/, group: "ease" },
  { test: /^delay-/, group: "delay" },
  { test: /^animate-/, group: "animate" },

  // --- transforms ------------------------------------------------------
  { test: /^-?translate-(x|y|z)-/, group: (m) => `translate-${m[1] ?? ""}` },
  { test: /^-?translate-/, group: "translate" },
  { test: /^-?scale-(x|y|z)-/, group: (m) => `scale-${m[1] ?? ""}` },
  { test: /^-?scale-/, group: "scale" },
  { test: /^-?rotate-/, group: "rotate" },
  { test: /^-?skew-(x|y)-/, group: (m) => `skew-${m[1] ?? ""}` },
  { test: /^origin-/, group: "origin" },
  { test: /^transform(?:-|$)/, group: "transform" },

  // --- interactivity ---------------------------------------------------
  { test: /^cursor-/, group: "cursor" },
  { test: /^pointer-events-/, group: "pointer-events" },
  { test: /^select-/, group: "select" },
  { test: /^resize(?:-|$)/, group: "resize" },
  { test: /^appearance-/, group: "appearance" },
  { test: /^touch-/, group: "touch" },
  { test: /^will-change-/, group: "will-change" },
  { test: /^-?scroll-m/, group: "scroll-margin" },
  { test: /^-?scroll-p/, group: "scroll-padding" },

  // --- svg -------------------------------------------------------------
  { test: /^fill-/, group: "fill" },
  { test: new RegExp(`^stroke-${NUMERIC}$`), group: "stroke-w" },
  { test: /^stroke-/, group: "stroke-color" },
];

/** Splits `hover:md:bg-red-500` into its variant prefix and its base class. */
function splitVariants(token: string): { prefix: string; base: string } {
  let depth = 0;
  let lastColon = -1;

  for (let i = 0; i < token.length; i += 1) {
    const char = token[i];
    if (char === "[" || char === "(") depth += 1;
    else if (char === "]" || char === ")") depth -= 1;
    else if (char === ":" && depth === 0) lastColon = i;
  }

  if (lastColon === -1) return { prefix: "", base: token };
  return { prefix: token.slice(0, lastColon + 1), base: token.slice(lastColon + 1) };
}

function resolveGroup(base: string): string | null {
  // Arbitrary property, e.g. `[--gap:1rem]`: the property name is the group.
  if (base.startsWith("[") && base.endsWith("]")) {
    const property = base.slice(1, -1).split(":")[0];
    return property === undefined ? null : `arbitrary-${property}`;
  }

  for (const rule of RULES) {
    const match = base.match(rule.test);
    if (match === null) continue;
    return typeof rule.group === "string" ? rule.group : rule.group(match);
  }

  return null;
}

/** Identity under which a class competes with others. */
function conflictKey(token: string): string {
  const { prefix, base } = splitVariants(token);

  // `!` marks an important utility; Tailwind v3 prefixes it, v4 suffixes it.
  // Important and normal utilities of the same group still conflict.
  const normalized = base.replace(/^!/, "").replace(/!$/, "");

  const group = resolveGroup(normalized);
  return group === null ? `raw:${token}` : `${prefix}${group}`;
}

/* -------------------------------------------------------------------------
 * 3. Public API
 * ---------------------------------------------------------------------- */

/** Resolves Tailwind conflicts in an already-split class list. */
export function mergeClasses(tokens: readonly string[]): string[] {
  const seen = new Set<string>();
  const kept: string[] = [];

  // Walk backwards so the last occurrence of a group is the one that wins,
  // then restore the original order.
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const token = tokens[i];
    if (token === undefined) continue;

    const key = conflictKey(token);
    if (seen.has(key)) continue;

    seen.add(key);
    kept.push(token);
  }

  return kept.reverse();
}

/** Joins class values and resolves Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  const tokens: string[] = [];
  for (const input of inputs) collect(input, tokens);
  return mergeClasses(tokens).join(" ");
}
