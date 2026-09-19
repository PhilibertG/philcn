import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { moveFor, nextIndex, typeaheadIndex } from "./list-navigation.ts";

describe("moveFor", () => {
  it("reads the arrows of a vertical list", () => {
    assert.equal(moveFor("ArrowDown", "vertical"), "next");
    assert.equal(moveFor("ArrowUp", "vertical"), "previous");
  });

  it("reads the arrows of a horizontal list", () => {
    assert.equal(moveFor("ArrowRight", "horizontal"), "next");
    assert.equal(moveFor("ArrowLeft", "horizontal"), "previous");
  });

  it("ignores the cross axis", () => {
    assert.equal(moveFor("ArrowRight", "vertical"), null);
    assert.equal(moveFor("ArrowDown", "horizontal"), null);
  });

  it("jumps to the ends", () => {
    assert.equal(moveFor("Home", "vertical"), "first");
    assert.equal(moveFor("End", "horizontal"), "last");
  });

  it("ignores everything else", () => {
    assert.equal(moveFor("a", "vertical"), null);
    assert.equal(moveFor("Enter", "vertical"), null);
  });
});

describe("nextIndex", () => {
  const list = { count: 4 };

  it("steps forwards and backwards", () => {
    assert.equal(nextIndex({ ...list, current: 1, move: "next" }), 2);
    assert.equal(nextIndex({ ...list, current: 1, move: "previous" }), 0);
  });

  it("jumps to either end", () => {
    assert.equal(nextIndex({ ...list, current: 2, move: "first" }), 0);
    assert.equal(nextIndex({ ...list, current: 2, move: "last" }), 3);
  });

  it("comes back round by default", () => {
    assert.equal(nextIndex({ ...list, current: 3, move: "next" }), 0);
    assert.equal(nextIndex({ ...list, current: 0, move: "previous" }), 3);
  });

  it("stops at the ends when told not to loop", () => {
    assert.equal(nextIndex({ ...list, current: 3, move: "next", loop: false }), 3);
    assert.equal(nextIndex({ ...list, current: 0, move: "previous", loop: false }), 0);
  });

  it("enters from the right end when nothing is focused", () => {
    assert.equal(nextIndex({ ...list, current: -1, move: "next" }), 0);
    assert.equal(nextIndex({ ...list, current: -1, move: "previous" }), 3);
  });

  it("steps over disabled entries", () => {
    assert.equal(nextIndex({ ...list, current: 0, move: "next", disabled: [1] }), 2);
    assert.equal(nextIndex({ ...list, current: 3, move: "previous", disabled: [2, 1] }), 0);
  });

  it("does not land on a disabled end", () => {
    assert.equal(nextIndex({ ...list, current: 1, move: "first", disabled: [0] }), 1);
    assert.equal(nextIndex({ ...list, current: 1, move: "last", disabled: [3] }), 2);
  });

  it("gives up when there is nowhere to go", () => {
    assert.equal(nextIndex({ count: 0, current: -1, move: "next" }), -1);
    assert.equal(nextIndex({ ...list, current: 0, move: "next", disabled: [0, 1, 2, 3] }), -1);
  });
});

describe("typeaheadIndex", () => {
  const labels = ["Apple", "Banana", "Blueberry", "Cherry"];

  it("finds the first entry starting with what was typed", () => {
    assert.equal(typeaheadIndex({ search: "b", labels, current: -1 }), 1);
    assert.equal(typeaheadIndex({ search: "blu", labels, current: -1 }), 2);
  });

  it("ignores letter case and stray spaces", () => {
    assert.equal(typeaheadIndex({ search: "  CHER ", labels, current: -1 }), 3);
  });

  it("walks through matches when the same letter is repeated", () => {
    assert.equal(typeaheadIndex({ search: "bb", labels, current: 1 }), 2);
    assert.equal(typeaheadIndex({ search: "bbb", labels, current: 2 }), 1);
  });

  it("stays where it is for a longer search that still matches", () => {
    assert.equal(typeaheadIndex({ search: "ba", labels, current: 1 }), 1);
  });

  it("skips disabled entries", () => {
    assert.equal(typeaheadIndex({ search: "b", labels, current: -1, disabled: [1] }), 2);
  });

  it("returns nothing when there is no match", () => {
    assert.equal(typeaheadIndex({ search: "z", labels, current: -1 }), -1);
  });

  it("returns nothing for an empty search or an empty list", () => {
    assert.equal(typeaheadIndex({ search: "", labels, current: -1 }), -1);
    assert.equal(typeaheadIndex({ search: "   ", labels, current: -1 }), -1);
    assert.equal(typeaheadIndex({ search: "a", labels: [], current: -1 }), -1);
  });
});
