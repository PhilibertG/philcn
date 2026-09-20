import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const config: NextConfig = {
  typedRoutes: true,
  // The library lives one folder up and shares this repository's lockfile, so
  // Next is told which folder is the site rather than left to guess.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default config;
