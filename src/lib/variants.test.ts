import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { variants } from "./variants.ts";

const button = variants(
  "inline-flex items-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
        outline: "border bg-background",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
      },
    },
    compoundVariants: [{ variant: "outline", size: "sm", class: "border-dashed" }],
    defaultVariants: { variant: "default", size: "default" },
  },
);

describe("variants", () => {
  it("applies the default selection", () => {
    assert.equal(
      button(),
      "inline-flex items-center rounded-md bg-primary text-primary-foreground h-9 px-4",
    );
  });

  it("applies an explicit selection", () => {
    assert.ok(button({ variant: "destructive" }).includes("bg-destructive"));
    assert.ok(!button({ variant: "destructive" }).includes("bg-primary"));
  });

  it("applies compound variants only when every condition matches", () => {
    assert.ok(button({ variant: "outline", size: "sm" }).includes("border-dashed"));
    assert.ok(!button({ variant: "outline", size: "lg" }).includes("border-dashed"));
    assert.ok(!button({ variant: "default", size: "sm" }).includes("border-dashed"));
  });

  it("appends className and resolves its conflicts", () => {
    assert.ok(button({ className: "px-8" }).includes("px-8"));
    assert.ok(!button({ className: "px-8" }).includes("px-4"));
  });

  it("accepts the class alias", () => {
    assert.ok(button({ class: "w-full" }).includes("w-full"));
  });

  it("falls back to the default when an axis is null", () => {
    assert.ok(button({ variant: null }).includes("bg-primary"));
  });

  it("works with no config at all", () => {
    assert.equal(variants("a b")(), "a b");
    assert.equal(variants()(), "");
  });

  it("supports boolean axes", () => {
    const toggle = variants("base", {
      variants: { active: { true: "on", false: "off" } },
      defaultVariants: { active: false },
    });
    assert.equal(toggle(), "base off");
    assert.equal(toggle({ active: true }), "base on");
  });

  it("supports a list of options in a compound variant", () => {
    const box = variants("base", {
      variants: { tone: { a: "ta", b: "tb", c: "tc" } },
      compoundVariants: [{ tone: ["a", "b"], class: "shared" }],
    });
    assert.ok(box({ tone: "a" }).includes("shared"));
    assert.ok(box({ tone: "b" }).includes("shared"));
    assert.ok(!box({ tone: "c" }).includes("shared"));
  });
});
