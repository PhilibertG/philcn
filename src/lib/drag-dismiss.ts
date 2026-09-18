/**
 * The arithmetic behind drag-to-dismiss. Kept as plain TypeScript, apart from
 * React and the DOM, so every rule can be unit tested.
 */

export type DragDirection = "top" | "bottom" | "left" | "right";

/** Which axis a direction travels on, and which way counts as leaving. */
export function axisOf(direction: DragDirection): "x" | "y" {
  return direction === "left" || direction === "right" ? "x" : "y";
}

/** +1 when a growing coordinate moves the panel away, -1 when it is the reverse. */
export function leavingSign(direction: DragDirection): 1 | -1 {
  return direction === "bottom" || direction === "right" ? 1 : -1;
}

/**
 * Rubber banding, as used by iOS. Dragging a panel further open than it can go
 * still moves it, but by less and less — the resistance rises instead of the
 * panel stopping dead against an invisible wall.
 */
export function rubberBand(distance: number, dimension: number, constant = 0.55): number {
  if (dimension <= 0) return 0;
  return (1 - 1 / ((distance * constant) / dimension + 1)) * dimension;
}

/**
 * How far the panel sits from its resting place, given a raw pointer travel.
 *
 * Travel towards leaving is followed exactly. Travel the other way is resisted,
 * so the panel never detaches from the edge it belongs to.
 */
export function offsetFor(travel: number, dimension: number): number {
  if (travel >= 0) return travel;
  return -rubberBand(-travel, dimension);
}

export interface DismissDecision {
  dismiss: boolean;
  reason: "flick" | "distance" | "held" | "returned";
}

export interface DismissInput {
  /** Distance travelled towards leaving, in pixels. Negative means the other way. */
  offset: number;
  /** Size of the panel along the drag axis. */
  dimension: number;
  /** Signed speed at release, in pixels per millisecond. Positive means leaving. */
  velocity: number;
}

/** Past this speed a flick dismisses regardless of how far it travelled. */
export const FLICK_VELOCITY = 0.11;
/** Past this share of the panel, letting go dismisses. */
export const DISTANCE_RATIO = 0.25;

/**
 * Whether letting go should close the panel.
 *
 * Speed is judged before distance: a short quick flick is a clear intent to
 * dismiss, while a long slow drag that is being pulled back is not.
 */
export function shouldDismiss({ offset, dimension, velocity }: DismissInput): DismissDecision {
  // Being pulled back at speed: the user changed their mind.
  if (velocity < -FLICK_VELOCITY) return { dismiss: false, reason: "returned" };
  if (velocity > FLICK_VELOCITY) return { dismiss: true, reason: "flick" };
  if (dimension > 0 && offset > dimension * DISTANCE_RATIO) {
    return { dismiss: true, reason: "distance" };
  }
  return { dismiss: false, reason: "held" };
}

export interface VelocitySample {
  position: number;
  time: number;
}

/**
 * Speed over the last stretch of the gesture rather than the whole of it, so a
 * long pause followed by a flick still reads as a flick.
 */
export function velocityFrom(samples: readonly VelocitySample[], window = 100): number {
  const last = samples[samples.length - 1];
  if (last === undefined) return 0;

  let reference = samples[0];
  for (let index = samples.length - 1; index >= 0; index -= 1) {
    const sample = samples[index];
    if (sample === undefined) continue;
    reference = sample;
    if (last.time - sample.time >= window) break;
  }
  if (reference === undefined) return 0;

  const elapsed = last.time - reference.time;
  if (elapsed <= 0) return 0;
  return (last.position - reference.position) / elapsed;
}
