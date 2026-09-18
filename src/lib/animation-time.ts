/**
 * Reading CSS animation timings. Kept apart from the components so it stays
 * plain TypeScript and can be unit tested directly.
 */

/** Reads a CSS time such as `0.7s` or `700ms` as milliseconds. */
export function parseCssTime(value: string): number {
  const trimmed = value.trim();
  const amount = Number.parseFloat(trimmed);
  if (!Number.isFinite(amount)) return 0;
  return trimmed.endsWith("ms") ? amount : amount * 1000;
}

/**
 * Longest `delay + duration` across every animation declared on an element,
 * in milliseconds.
 *
 * Returns 0 when nothing is animating, and Infinity for an animation that
 * never ends — both cases mean there is no exit to wait for.
 */
export function longestAnimationMs(styles: {
  animationName: string;
  animationDuration: string;
  animationDelay: string;
  animationIterationCount: string;
}): number {
  if (styles.animationName === "none") return 0;

  if (styles.animationIterationCount.split(",").some((count) => count.trim() === "infinite")) {
    return Number.POSITIVE_INFINITY;
  }

  const durations = styles.animationDuration.split(",");
  const delays = styles.animationDelay.split(",");

  let longest = 0;
  for (const [index, duration] of durations.entries()) {
    const delay = delays[index] ?? delays[0] ?? "0s";
    const total = parseCssTime(duration) + parseCssTime(delay);
    if (total > longest) longest = total;
  }
  return longest;
}
