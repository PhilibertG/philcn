/**
 * Moving through a list with the keyboard, and finding an entry by typing its
 * first letters. Plain TypeScript, apart from React and the DOM, so every
 * rule can be unit tested.
 */

export type NavigationMove = "next" | "previous" | "first" | "last";

/** Which key does what. Arrow keys depend on how the list is laid out. */
export function moveFor(
  key: string,
  orientation: "vertical" | "horizontal",
): NavigationMove | null {
  const forward = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
  const backward = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

  if (key === forward) return "next";
  if (key === backward) return "previous";
  if (key === "Home") return "first";
  if (key === "End") return "last";
  return null;
}

export interface NextIndexInput {
  /** Where the focus is now. -1 when nothing is focused yet. */
  current: number;
  /** How many entries the list has. */
  count: number;
  move: NavigationMove;
  /** Walking past the last entry comes back to the first. */
  loop?: boolean;
  /** Entries that cannot be focused, by index. */
  disabled?: readonly number[];
}

/**
 * The entry the focus should move to.
 *
 * Returns -1 when there is nowhere to go: an empty list, or one where every
 * entry is disabled.
 */
export function nextIndex({
  current,
  count,
  move,
  loop = true,
  disabled = [],
}: NextIndexInput): number {
  if (count <= 0) return -1;

  const blocked = new Set(disabled);
  if (blocked.size >= count) return -1;

  const step = move === "previous" || move === "last" ? -1 : 1;
  let candidate: number;

  if (move === "first") candidate = 0;
  else if (move === "last") candidate = count - 1;
  else if (current < 0) {
    // Nothing focused yet: entering from the top goes to the first entry,
    // entering from the bottom to the last.
    candidate = step === 1 ? 0 : count - 1;
  } else {
    candidate = current + step;
    if (candidate < 0) {
      if (!loop) return current;
      candidate = count - 1;
    } else if (candidate >= count) {
      if (!loop) return current;
      candidate = 0;
    }
  }

  // Step over anything disabled, without going round for ever.
  const direction = move === "previous" ? -1 : move === "last" ? -1 : 1;
  for (let attempts = 0; attempts < count; attempts += 1) {
    if (!blocked.has(candidate)) return candidate;

    candidate += direction;
    if (candidate < 0) {
      if (!loop) return current >= 0 && !blocked.has(current) ? current : -1;
      candidate = count - 1;
    } else if (candidate >= count) {
      if (!loop) return current >= 0 && !blocked.has(current) ? current : -1;
      candidate = 0;
    }
  }

  return -1;
}

/** Typing stops being one search and becomes a new one after this long. */
export const TYPEAHEAD_RESET_MS = 1000;

export interface TypeaheadInput {
  /** What has been typed so far, most recent last. */
  search: string;
  /** The text of each entry, in order. */
  labels: readonly string[];
  /** Where the focus is now, so a repeated letter walks through matches. */
  current: number;
  disabled?: readonly number[];
}

/**
 * The entry a typed search should jump to, or -1 when nothing matches.
 *
 * Typing the same letter over and over walks through the entries starting
 * with it rather than sticking to the first.
 */
export function typeaheadIndex({
  search,
  labels,
  current,
  disabled = [],
}: TypeaheadInput): number {
  const needle = search.trim().toLowerCase();
  if (needle === "" || labels.length === 0) return -1;

  const blocked = new Set(disabled);

  // A repeated single letter means "the next one starting with this".
  const repeated = needle.length > 1 && [...needle].every((letter) => letter === needle[0]);
  const query = repeated ? (needle[0] ?? "") : needle;

  // Start looking just after the current entry, so repeats move along.
  const start = repeated ? current + 1 : current < 0 ? 0 : current;

  for (let offset = 0; offset < labels.length; offset += 1) {
    const index = (start + offset + labels.length) % labels.length;
    if (blocked.has(index)) continue;
    if ((labels[index] ?? "").trim().toLowerCase().startsWith(query)) return index;
  }

  return -1;
}
