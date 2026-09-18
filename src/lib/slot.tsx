/**
 * Slot — renders a component's props onto the child element instead of onto a
 * wrapper. This is what powers the `asChild` prop:
 *
 *     <Button asChild><a href="/">Home</a></Button>
 *
 * renders a single `<a>` carrying the button's classes and handlers, rather
 * than a `<button>` wrapping an `<a>`.
 *
 * Written from scratch.
 */

import * as React from "react";

import { cn } from "./cn.ts";

type AnyProps = Record<string, unknown>;

/** Calls both refs, whichever form each one takes. */
function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null): void => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref !== null && ref !== undefined) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

/**
 * Merges the slot's own props with the child's.
 *
 * The child wins on plain values, so a caller can always override. Event
 * handlers are chained (slot first, then child) and `className` / `style` are
 * combined rather than replaced.
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    const isEventHandler = /^on[A-Z]/.test(key);

    if (isEventHandler) {
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
      merged[key] = cn(slotValue as string, childValue as string);
      continue;
    }

    if (key === "style") {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    }
  }

  return merged;
}

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  if (!React.isValidElement(children)) return null;

  const childProps = children.props as AnyProps;
  // React 19 exposes `ref` as a normal prop; React 18 keeps it on the element.
  const childRef =
    (childProps["ref"] as React.Ref<HTMLElement> | undefined) ??
    ((children as unknown as { ref?: React.Ref<HTMLElement> }).ref ?? undefined);

  return React.cloneElement(children, {
    ...mergeProps(slotProps as AnyProps, childProps),
    ref: composeRefs(forwardedRef, childRef),
  } as Partial<unknown> & React.Attributes);
});
