/**
 * Variant builder.
 *
 * Declares the visual declensions of a component (a button that is primary or
 * destructive, small or large) and turns a selection into a class string.
 *
 * API-compatible with `class-variance-authority`, written from scratch.
 */

import { cn, type ClassValue } from "./cn.ts";

/** `{ variant: { default: "...", destructive: "..." }, size: { ... } }` */
export type VariantShape = Record<string, Record<string, ClassValue>>;

/** A choice of one option per variant axis. */
export type VariantSelection<V extends VariantShape> = {
  [Axis in keyof V]?: StringToBoolean<keyof V[Axis]> | null | undefined;
};

/**
 * A compound-variant condition. Same shape as a selection, except an axis may
 * also list several options that all satisfy the rule.
 */
export type CompoundSelection<V extends VariantShape> = {
  [Axis in keyof V]?:
    | StringToBoolean<keyof V[Axis]>
    | ReadonlyArray<StringToBoolean<keyof V[Axis]>>
    | null
    | undefined;
};

/** Lets a `true` / `false` variant axis be selected with a real boolean. */
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

/** Extra class names accepted by every generated function. */
interface ClassOverrides {
  class?: ClassValue;
  className?: ClassValue;
}

export type VariantParams<V extends VariantShape> = VariantSelection<V> & ClassOverrides;

export interface VariantConfig<V extends VariantShape> {
  variants?: V;
  compoundVariants?: ReadonlyArray<CompoundSelection<V> & ClassOverrides>;
  defaultVariants?: VariantSelection<V>;
}

/** Infers the accepted props of a generated variant function. */
export type VariantProps<T extends (...args: never[]) => string> =
  Omit<NonNullable<Parameters<T>[0]>, "class" | "className">;

function normalize(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  return String(value);
}

export function variants<V extends VariantShape>(
  base?: ClassValue,
  config?: VariantConfig<V>,
): (params?: VariantParams<V>) => string {
  const axes = config?.variants;
  const defaults = config?.defaultVariants;
  const compounds = config?.compoundVariants;

  return (params?: VariantParams<V>): string => {
    const collected: ClassValue[] = [base];

    /** The option selected on one axis, falling back to the default. */
    const selected = (axis: string): string | undefined => {
      const fromParams = params === undefined ? undefined : normalize(params[axis]);
      if (fromParams !== undefined) return fromParams;
      return defaults === undefined ? undefined : normalize(defaults[axis]);
    };

    if (axes !== undefined) {
      for (const axis of Object.keys(axes)) {
        const option = selected(axis);
        if (option === undefined) continue;
        collected.push(axes[axis]?.[option]);
      }
    }

    if (compounds !== undefined) {
      for (const compound of compounds) {
        const matches = Object.keys(compound).every((key) => {
          if (key === "class" || key === "className") return true;

          const expected = compound[key];
          const actual = selected(key);

          // An array lists several options that all satisfy the rule.
          if (Array.isArray(expected)) {
            return expected.some((option) => normalize(option) === actual);
          }
          return normalize(expected) === actual;
        });

        if (matches) collected.push(compound.class, compound.className);
      }
    }

    collected.push(params?.class, params?.className);
    return cn(...collected);
  };
}
