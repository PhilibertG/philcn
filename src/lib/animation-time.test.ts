import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { longestAnimationMs, parseCssTime } from "./animation-time.ts";

describe("parseCssTime", () => {
  it("reads seconds", () => {
    assert.equal(parseCssTime("0.7s"), 700);
    assert.equal(parseCssTime("1s"), 1000);
    assert.equal(parseCssTime("2.5s"), 2500);
  });

  it("reads milliseconds", () => {
    assert.equal(parseCssTime("700ms"), 700);
    assert.equal(parseCssTime("0ms"), 0);
  });

  it("tolerates surrounding whitespace", () => {
    assert.equal(parseCssTime("  0.3s "), 300);
  });

  it("returns zero for anything unparseable", () => {
    assert.equal(parseCssTime("none"), 0);
    assert.equal(parseCssTime(""), 0);
    assert.equal(parseCssTime("auto"), 0);
  });

  it("handles a negative delay", () => {
    assert.equal(parseCssTime("-0.2s"), -200);
  });
});

const styles = (over: Partial<Parameters<typeof longestAnimationMs>[0]> = {}) => ({
  animationName: "fade",
  animationDuration: "0.7s",
  animationDelay: "0s",
  animationIterationCount: "1",
  ...over,
});

describe("longestAnimationMs", () => {
  it("returns zero when nothing is animating", () => {
    assert.equal(longestAnimationMs(styles({ animationName: "none" })), 0);
  });

  it("returns the declared duration", () => {
    assert.equal(longestAnimationMs(styles()), 700);
  });

  it("adds the delay", () => {
    assert.equal(longestAnimationMs(styles({ animationDelay: "0.3s" })), 1000);
  });

  it("takes the longest of several animations", () => {
    assert.equal(
      longestAnimationMs(
        styles({ animationName: "a, b", animationDuration: "0.2s, 0.9s", animationDelay: "0s, 0s" }),
      ),
      900,
    );
  });

  it("pairs each duration with its own delay", () => {
    assert.equal(
      longestAnimationMs(
        styles({
          animationName: "a, b",
          animationDuration: "0.5s, 0.2s",
          animationDelay: "0s, 1s",
        }),
      ),
      1200,
    );
  });

  it("reuses a single delay for every animation", () => {
    assert.equal(
      longestAnimationMs(
        styles({ animationName: "a, b", animationDuration: "0.2s, 0.4s", animationDelay: "0.1s" }),
      ),
      500,
    );
  });

  it("treats an endless animation as having no exit", () => {
    assert.equal(
      longestAnimationMs(styles({ animationIterationCount: "infinite" })),
      Number.POSITIVE_INFINITY,
    );
    assert.equal(
      longestAnimationMs(styles({ animationIterationCount: "1, infinite" })),
      Number.POSITIVE_INFINITY,
    );
  });
});
