/**
 * Slot — renders a component's props onto another element instead of onto a
 * wrapper of its own. This is what powers replacing a trigger's element:
 *
 *     <Button asChild><a href="/">Home</a></Button>      // Radix spelling
 *     <Button render={<a href="/">Home</a>} />           // Base UI spelling
 *
 * Both render a single `<a>` carrying the button's classes and handlers,
 * rather than a `<button>` wrapping an `<a>`. shadcn publishes a Radix and a
 * Base UI flavour, so philcn accepts either.
 */

import * as React from "react";

import { cn } from "./cn.ts";
import { composeRefs, mergeProps, type AnyProps } from "./compose.ts";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** The element to render. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, render, ...slotProps },
  forwardedRef,
) {
  const element = render ?? children;
  if (!React.isValidElement(element)) return null;

  const childProps = element.props as AnyProps;
  // React 19 exposes `ref` as a normal prop; React 18 keeps it on the element.
  const childRef =
    (childProps["ref"] as React.Ref<HTMLElement> | undefined) ??
    (element as unknown as { ref?: React.Ref<HTMLElement> }).ref;

  const merged = mergeProps(slotProps as AnyProps, childProps, cn);

  // With `render`, anything between the tags belongs to the rendered element —
  // unless it brought its own children.
  if (render !== undefined && childProps["children"] === undefined && children !== undefined) {
    merged["children"] = children;
  }

  // A ref is attached only when there is one to forward. An element that
  // carries a ref cannot be rendered inside a React Server Component, so
  // attaching an empty one would break `asChild` on a Next.js App Router page
  // that is not marked `"use client"`.
  const hasRef =
    (forwardedRef !== null && forwardedRef !== undefined) ||
    (childRef !== null && childRef !== undefined);

  return React.cloneElement(element, {
    ...merged,
    ...(hasRef ? { ref: composeRefs<HTMLElement>(forwardedRef, childRef) } : {}),
  } as Partial<unknown> & React.Attributes);
});

export { Slot };
