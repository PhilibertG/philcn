"use client";

import * as React from "react";

import { useCallbackRef } from "./use-callback-ref.ts";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.ts";

export interface UseControllableStateParams<T> {
  /** Supplied by the caller — when present, the caller owns the value. */
  prop?: T | undefined;
  /** Starting value when the caller does not own it. */
  defaultProp?: T | undefined;
  /** Called whenever the value should change. */
  onChange?: ((value: T) => void) | undefined;
}

/**
 * Lets a component work both ways:
 *
 *  - uncontrolled — the component keeps the value itself, from `defaultProp`
 *  - controlled — the caller passes `prop` and reacts to `onChange`
 *
 * Every component with an open/closed or checked/unchecked state uses this, so
 * the caller can either leave it alone or drive it.
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>): [
  T | undefined,
  (next: React.SetStateAction<T | undefined>) => void,
] {
  const [uncontrolled, setUncontrolled] = React.useState<T | undefined>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolled;

  const handleChange = useCallbackRef(onChange);

  // Mirrors the current value so the setter can resolve an updater function
  // without needing the value in its dependency list.
  const valueRef = React.useRef(value);
  useIsomorphicLayoutEffect(() => {
    valueRef.current = value;
  });

  const setValue = React.useCallback(
    (next: React.SetStateAction<T | undefined>) => {
      const previous = valueRef.current;
      const resolved =
        typeof next === "function"
          ? (next as (prev: T | undefined) => T | undefined)(previous)
          : next;

      if (Object.is(resolved, previous)) return;

      valueRef.current = resolved;
      if (!isControlled) setUncontrolled(resolved);
      if (resolved !== undefined) handleChange(resolved);
    },
    [isControlled, handleChange],
  );

  return [value, setValue];
}
