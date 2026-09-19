/**
 * Turning a side and an alignment into the values a positioning engine wants,
 * and back again. Plain TypeScript so every mapping is unit tested.
 */

export type Side = "top" | "right" | "bottom" | "left";
export type Align = "start" | "center" | "end";

/** What the engine calls a placement: "bottom", "bottom-start", "left-end"… */
export type Placement =
  | Side
  | `${Side}-start`
  | `${Side}-end`;

/** shadcn speaks of a side and an alignment; the engine wants one string. */
export function toPlacement(side: Side, align: Align): Placement {
  return align === "center" ? side : (`${side}-${align}` as Placement);
}

const SIDES: readonly string[] = ["top", "right", "bottom", "left"];

/**
 * And the reverse, so the resolved position can be reported back in the
 * markup. Anything unrecognised falls back to a centred bottom placement —
 * the engine may return a side we do not model, and a wrong badge on the
 * element is better than a crash.
 */
export function fromPlacement(placement: string): { side: Side; align: Align } {
  const [side, align] = placement.split("-");
  return {
    side: side !== undefined && SIDES.includes(side) ? (side as Side) : "bottom",
    align: align === "start" || align === "end" ? align : "center",
  };
}

/** The opposite edge: a panel below its trigger grows from its own top. */
const OPPOSITE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/**
 * Where the panel should grow from when it appears.
 *
 * A menu must look like it came out of the thing that opened it, so it scales
 * from the corner nearest its trigger — never from its own centre.
 */
export function transformOriginFor(placement: string): string {
  const { side, align } = fromPlacement(placement);
  const anchoredEdge = OPPOSITE[side];

  if (align === "center") {
    return side === "top" || side === "bottom" ? `${anchoredEdge} center` : `center ${anchoredEdge}`;
  }

  // On a vertical side the alignment runs left to right, and the other way on
  // a horizontal one.
  if (side === "top" || side === "bottom") {
    return `${anchoredEdge} ${align === "start" ? "left" : "right"}`;
  }
  return `${align === "start" ? "top" : "bottom"} ${anchoredEdge}`;
}
