import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cn } from "./cn.ts";

describe("cn — joining", () => {
  it("joins plain strings", () => {
    assert.equal(cn("a", "b"), "a b");
  });

  it("skips falsy values", () => {
    assert.equal(cn("a", false, null, undefined, "", "b"), "a b");
  });

  it("accepts arrays and objects", () => {
    assert.equal(cn(["a", ["b"]], { c: true, d: false }), "a b c");
  });

  it("splits multi-class strings", () => {
    assert.equal(cn("  a   b  "), "a b");
  });

  it("returns an empty string for no input", () => {
    assert.equal(cn(), "");
  });
});

describe("cn — conflict resolution", () => {
  it("keeps the last of a conflicting pair", () => {
    assert.equal(cn("px-2", "px-4"), "px-4");
    assert.equal(cn("text-sm", "text-lg"), "text-lg");
    assert.equal(cn("bg-red-500", "bg-blue-500"), "bg-blue-500");
  });

  it("preserves the position of surviving classes", () => {
    assert.equal(cn("px-2 font-bold", "px-4"), "font-bold px-4");
  });

  it("does not merge across different properties", () => {
    assert.equal(cn("px-2", "py-4"), "px-2 py-4");
    assert.equal(cn("mt-2", "mb-2"), "mt-2 mb-2");
  });

  it("treats a shorthand and its axis as separate groups", () => {
    assert.equal(cn("p-2", "px-4"), "p-2 px-4");
  });

  it("separates font size from text color", () => {
    assert.equal(cn("text-sm", "text-red-500"), "text-sm text-red-500");
    assert.equal(cn("text-red-500", "text-blue-500"), "text-blue-500");
    assert.equal(cn("text-sm", "text-[10px]"), "text-[10px]");
    assert.equal(cn("text-red-500", "text-[#fff]"), "text-[#fff]");
  });

  it("separates text alignment from text color", () => {
    assert.equal(cn("text-center", "text-red-500"), "text-center text-red-500");
  });

  it("scopes conflicts to their variant prefix", () => {
    assert.equal(cn("bg-red-500", "hover:bg-blue-500"), "bg-red-500 hover:bg-blue-500");
    assert.equal(cn("hover:bg-red-500", "hover:bg-blue-500"), "hover:bg-blue-500");
    assert.equal(cn("dark:md:p-2", "dark:md:p-4"), "dark:md:p-4");
  });

  it("handles colons inside arbitrary variants", () => {
    assert.equal(
      cn("data-[state=open]:bg-red-500", "data-[state=open]:bg-blue-500"),
      "data-[state=open]:bg-blue-500",
    );
    assert.equal(cn("[&_svg]:size-4", "[&_svg]:size-6"), "[&_svg]:size-6");
  });

  it("separates border width from border color", () => {
    assert.equal(cn("border-2", "border-red-500"), "border-2 border-red-500");
    assert.equal(cn("border", "border-4"), "border-4");
    assert.equal(cn("border-t-2", "border-b-2"), "border-t-2 border-b-2");
  });

  it("separates rounded corners", () => {
    assert.equal(cn("rounded-md", "rounded-lg"), "rounded-lg");
    assert.equal(cn("rounded-t-md", "rounded-b-md"), "rounded-t-md rounded-b-md");
    assert.equal(cn("rounded-sm", "rounded-full"), "rounded-full");
  });

  it("separates ring width from ring color", () => {
    assert.equal(cn("ring-2", "ring-red-500"), "ring-2 ring-red-500");
    assert.equal(cn("ring", "ring-4"), "ring-4");
  });

  it("separates shadow size from shadow color", () => {
    assert.equal(cn("shadow-sm", "shadow-red-500"), "shadow-sm shadow-red-500");
    assert.equal(cn("shadow-sm", "shadow-lg"), "shadow-lg");
  });

  it("handles negative utilities", () => {
    assert.equal(cn("mt-2", "-mt-4"), "-mt-4");
    assert.equal(cn("-translate-x-1", "translate-x-2"), "translate-x-2");
  });

  it("handles width, height and size", () => {
    assert.equal(cn("w-4", "w-8"), "w-8");
    assert.equal(cn("w-4 h-4", "size-6"), "w-4 h-4 size-6");
    assert.equal(cn("max-w-sm", "max-w-lg"), "max-w-lg");
    assert.equal(cn("w-4", "min-w-8"), "w-4 min-w-8");
  });

  it("handles display and position", () => {
    assert.equal(cn("block", "flex"), "flex");
    assert.equal(cn("absolute", "relative"), "relative");
    assert.equal(cn("hidden", "inline-flex"), "inline-flex");
  });

  it("handles arbitrary properties", () => {
    assert.equal(cn("[--gap:1rem]", "[--gap:2rem]"), "[--gap:2rem]");
    assert.equal(cn("[--gap:1rem]", "[--size:2rem]"), "[--gap:1rem] [--size:2rem]");
  });

  it("merges important utilities with their normal counterpart", () => {
    assert.equal(cn("p-2", "p-4!"), "p-4!");
    assert.equal(cn("p-2", "!p-4"), "!p-4");
  });

  it("deduplicates identical unknown classes", () => {
    assert.equal(cn("group", "group"), "group");
    assert.equal(cn("peer", "group"), "peer group");
  });

  it("leaves unknown classes untouched", () => {
    assert.equal(cn("my-custom-class", "another-one"), "my-custom-class another-one");
  });
});
