import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type { ClassValue };

/**
 * Joins class names and lets the last Tailwind class of a kind win.
 *
 * `clsx` flattens whatever it is given — strings, conditions, arrays, objects
 * — and `tailwind-merge` then drops the classes that a later one overrides, so
 * `cn("px-2", "px-4")` is `px-4` rather than a fight in the stylesheet. That
 * is what makes a `className` passed from outside able to override the
 * component's own styling instead of landing next to it.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
