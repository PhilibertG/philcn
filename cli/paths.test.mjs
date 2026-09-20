import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { aliasesFrom, DEFAULT_ALIASES, rewriteFile, targetFor } from "./paths.mjs";

const aliases = { ui: "@/components/ui", lib: "@/lib/philcn", utils: "@/lib/utils" };
const resolveAlias = (alias) => alias.replace(/^@\//, "src/");

describe("aliasesFrom", () => {
  it("falls back to the usual places", () => {
    assert.deepEqual(aliasesFrom(null), DEFAULT_ALIASES);
    assert.deepEqual(aliasesFrom({}), DEFAULT_ALIASES);
  });

  it("reads a components.json written by philcn", () => {
    const config = { aliases: { ui: "@/ui", lib: "@/lib", philcn: "@/lib/philcn" } };
    assert.deepEqual(aliasesFrom(config), {
      ui: "@/ui",
      lib: "@/lib/philcn",
      utils: "@/lib/utils",
    });
  });

  it("follows a shadcn components.json", () => {
    const config = { aliases: { components: "@/components", lib: "@/lib", utils: "@/lib/utils" } };
    assert.deepEqual(aliasesFrom(config), {
      ui: "@/components/ui",
      lib: "@/lib/philcn",
      utils: "@/lib/utils",
    });
  });
});

describe("targetFor", () => {
  it("sends a component to the ui folder", () => {
    assert.equal(
      targetFor("src/components/ui/button.tsx", aliases, resolveAlias),
      "src/components/ui/button.tsx",
    );
  });

  it("sends a brick to the philcn folder", () => {
    assert.equal(targetFor("src/lib/slot.tsx", aliases, resolveAlias), "src/lib/philcn/slot.tsx");
  });
});

describe("rewriteFile, handing the component over on its own", () => {
  const source = [
    'import * as React from "react";',
    'import { cn } from "../../lib/cn.ts";',
    'import { Slot } from "../../lib/slot.tsx";',
    'import { Button } from "./button.tsx";',
  ].join("\n");
  const written = rewriteFile("src/components/ui/x.tsx", source, aliases);

  it("reads cn from the project's own utils, where shadcn puts it", () => {
    assert.match(written, /import \{ cn \} from "@\/lib\/utils";/);
  });

  it("takes the shared behaviour from the package", () => {
    assert.match(written, /import \{ Slot \} from "philcn\/slot";/);
  });

  it("keeps a sibling component in the ui folder", () => {
    assert.match(written, /import \{ Button \} from "@\/components\/ui\/button";/);
  });

  it("leaves packages alone", () => {
    assert.match(written, /import \* as React from "react";/);
  });
});

describe("rewriteFile, copying everything", () => {
  const options = { standalone: true };

  it("points a component at the copied bricks", () => {
    const source = 'import { Slot } from "../../lib/slot.tsx";';
    assert.equal(
      rewriteFile("src/components/ui/button.tsx", source, aliases, options),
      'import { Slot } from "@/lib/philcn/slot";',
    );
  });

  it("keeps a brick's neighbours in the brick folder", () => {
    const source = 'import { Floating } from "./floating.tsx";';
    assert.equal(
      rewriteFile("src/lib/menu.tsx", source, aliases, options),
      'import { Floating } from "@/lib/philcn/floating";',
    );
  });

  it("still reads cn from the utils file, so it is never copied twice", () => {
    const source = 'import { cn } from "./cn.ts";';
    assert.equal(
      rewriteFile("src/lib/menu.tsx", source, aliases, options),
      'import { cn } from "@/lib/utils";',
    );
  });

  it("rewrites a type-only import too", () => {
    const source = 'import type { Side } from "../../lib/anchored.ts";';
    assert.equal(
      rewriteFile("src/components/ui/popover.tsx", source, aliases, options),
      'import type { Side } from "@/lib/philcn/anchored";',
    );
  });
});
