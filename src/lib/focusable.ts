/**
 * Finding the elements a keyboard user can reach. Kept as plain TypeScript so
 * it can be unit tested without a browser.
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "summary",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]",
].join(",");

export { FOCUSABLE_SELECTOR };

/** True when the element is not hidden from layout or explicitly opted out. */
export function isReachable(
  element: Element,
  getStyles: (element: Element) => { display: string; visibility: string },
): boolean {
  if (element.hasAttribute("disabled")) return false;
  if (element.getAttribute("aria-hidden") === "true") return false;
  if (element.getAttribute("tabindex") === "-1") return false;
  if ((element as HTMLElement).hidden) return false;

  const styles = getStyles(element);
  return styles.display !== "none" && styles.visibility !== "hidden";
}

/** The focusable descendants of `container`, in tab order. */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const candidates = [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
  return candidates.filter((element) =>
    isReachable(element, (node) => window.getComputedStyle(node)),
  );
}
