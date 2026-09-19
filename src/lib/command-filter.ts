/**
 * Deciding which entries a search keeps, and in what order. Plain TypeScript
 * so every rule can be unit tested.
 */

/** Zero hides the entry; a larger number sorts it higher. */
export type CommandFilter = (value: string, search: string, keywords?: readonly string[]) => number;

function normalise(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      // Searching for "cafe" must find "café", and "reglage" must find
      // "réglage". Accents are stripped from both sides before comparing.
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
  );
}

/**
 * The default rule.
 *
 * An entry whose name starts with what was typed comes before one that merely
 * contains it, and a match on the name itself comes before a match on a
 * keyword — searching "set" should offer "Settings" before "Reset password".
 */
export const defaultCommandFilter: CommandFilter = (value, search, keywords = []) => {
  const needle = normalise(search);
  if (needle === "") return 1;

  const name = normalise(value);
  if (name.startsWith(needle)) return 3;
  if (name.includes(needle)) return 2;

  for (const keyword of keywords) {
    if (normalise(keyword).includes(needle)) return 1;
  }

  return 0;
};

export interface RankedEntry {
  value: string;
  keywords?: readonly string[] | undefined;
}

/**
 * The entries a search keeps, best first.
 *
 * Entries scoring the same keep the order they appear in, so a list with no
 * search reads exactly as it was written.
 */
export function rankEntries<T extends RankedEntry>(
  entries: readonly T[],
  search: string,
  filter: CommandFilter = defaultCommandFilter,
): T[] {
  const scored = entries.map((entry, index) => ({
    entry,
    index,
    score: filter(entry.value, search, entry.keywords),
  }));

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => (b.score === a.score ? a.index - b.index : b.score - a.score))
    .map((item) => item.entry);
}
