import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { defaultCommandFilter, rankEntries } from "./command-filter.ts";

describe("defaultCommandFilter", () => {
  it("keeps everything when nothing has been typed", () => {
    assert.ok(defaultCommandFilter("Settings", "") > 0);
    assert.ok(defaultCommandFilter("Settings", "   ") > 0);
  });

  it("ignores letter case", () => {
    assert.ok(defaultCommandFilter("Settings", "SET") > 0);
  });

  it("ignores accents on either side", () => {
    assert.ok(defaultCommandFilter("Réglages", "reglages") > 0);
    assert.ok(defaultCommandFilter("Reglages", "réglages") > 0);
    assert.ok(defaultCommandFilter("Café", "cafe") > 0);
  });

  it("ranks a name that starts with the search above one that contains it", () => {
    assert.ok(defaultCommandFilter("Settings", "set") > defaultCommandFilter("Reset", "set"));
  });

  it("ranks a name above a keyword", () => {
    assert.ok(
      defaultCommandFilter("Reset", "set") > defaultCommandFilter("Profile", "set", ["settings"]),
    );
  });

  it("finds an entry through its keywords", () => {
    assert.ok(defaultCommandFilter("Profile", "avatar", ["avatar", "picture"]) > 0);
  });

  it("rejects what does not match at all", () => {
    assert.equal(defaultCommandFilter("Settings", "zzz"), 0);
    assert.equal(defaultCommandFilter("Settings", "zzz", ["account"]), 0);
  });
});

describe("rankEntries", () => {
  const entries = [
    { value: "Reset password" },
    { value: "Settings" },
    { value: "Profile", keywords: ["avatar"] },
  ];

  it("keeps the written order when nothing is typed", () => {
    assert.deepEqual(
      rankEntries(entries, "").map((e) => e.value),
      ["Reset password", "Settings", "Profile"],
    );
  });

  it("puts the best match first", () => {
    assert.deepEqual(
      rankEntries(entries, "set").map((e) => e.value),
      ["Settings", "Reset password"],
    );
  });

  it("drops what does not match", () => {
    assert.deepEqual(
      rankEntries(entries, "avatar").map((e) => e.value),
      ["Profile"],
    );
  });

  it("returns nothing when nothing matches", () => {
    assert.deepEqual(rankEntries(entries, "zzzz"), []);
  });

  it("keeps the written order between equal scores", () => {
    const equal = [{ value: "alpha one" }, { value: "alpha two" }, { value: "alpha three" }];
    assert.deepEqual(
      rankEntries(equal, "alpha").map((e) => e.value),
      ["alpha one", "alpha two", "alpha three"],
    );
  });

  it("accepts a rule of its own", () => {
    const onlyExact = (value: string, search: string) => (value === search ? 1 : 0);
    assert.deepEqual(
      rankEntries(entries, "Settings", onlyExact).map((e) => e.value),
      ["Settings"],
    );
  });
});
