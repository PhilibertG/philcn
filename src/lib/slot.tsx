/**
 * Slot — renders a component's props onto the child element instead of onto a
 * wrapper. This is what powers the `asChild` prop:
 *
 *     <Button asChild><a href="/">Home</a></Button>
 *
 * renders a single `<a>` carrying the button's classes and handlers, rather
 * than a `<button>` wrapping an `<a>`.
 */

import * as React from "react";

import { cn } from "./cn.ts";
import { composeRefs, mergeProps, type AnyProps } from "./compose.ts";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  if (!React.isValidElement(children)) return null;

  const childProps = children.props as AnyProps;
  // React 19 exposes `ref` as a normal prop; React 18 keeps it on the element.
  const childRef =
    (childProps["ref"] as React.Ref<HTMLElement> | undefined) ??
    (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;

  return React.cloneElement(children, {
    ...mergeProps(slotProps as AnyProps, childProps, cn),
    ref: composeRefs<HTMLElement>(forwardedRef, childRef),
  } as Partial<unknown> & React.Attributes);
});

export { Slot };
