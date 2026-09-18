import * as React from "react";

/**
 * Returns `providedId` when the caller supplied one, otherwise a generated id
 * that is stable across renders and consistent between server and client.
 * Used to wire a control to its label or description.
 */
export function useId(providedId?: string | undefined): string {
  const generated = React.useId();
  return providedId ?? generated;
}
