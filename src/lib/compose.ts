import type * as React from "react";

import type { ClassValue } from "./cn.ts";

export type AnyProps = Record<string, unknown>;

/** Assigns a node to a ref, whichever of the two forms the ref takes. */
function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null): void {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T | null>).current = node;
  }
}

/** Combines several refs into one, so a node reaches all of them. */
export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>): (node: T | null) => void {
  return (node: T | null) => {
    for (const ref of refs) assignRef(ref, node);
  };
}

/**
 * Chains two event handlers. The caller's runs first; it can stop the built-in
 * one by calling `event.preventDefault()`, unless `checkForDefaultPrevented`
 * is false.
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  theirHandler: ((event: E) => void) | undefined,
  ourHandler: ((event: E) => void) | undefined,
  { checkForDefaultPrevented = true }: { checkForDefaultPrevented?: boolean } = {},
): (event: E) => void {
  return (event: E) => {
    theirHandler?.(event);
    if (checkForDefaultPrevented && event.defaultPrevented) return;
    ourHandler?.(event);
  };
}

/**
 * Merges a slot's props with its child's.
 *
 * The child wins on plain values, so a caller can always override. Event
 * handlers are chained (child first, then slot) and `className` / `style` are
 * combined rather than replaced.
 */
export function mergeProps(
  slotProps: AnyProps,
  childProps: AnyProps,
  joinClassNames: (...values: ClassValue[]) => string,
): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (/^on[A-Z]/.test(key)) {
      if (typeof slotValue === "function" && typeof childValue === "function") {
        merged[key] = (...args: unknown[]) => {
          (childValue as (...a: unknown[]) => unknown)(...args);
          (slotValue as (...a: unknown[]) => unknown)(...args);
        };
      } else if (typeof slotValue === "function") {
        merged[key] = slotValue;
      }
      continue;
    }

    if (key === "className") {
      merged[key] = joinClassNames(slotValue as ClassValue, childValue as ClassValue);
      continue;
    }

    if (key === "style") {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    }
  }

  return merged;
}
