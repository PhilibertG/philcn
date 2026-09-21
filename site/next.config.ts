import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const config: NextConfig = {
  typedRoutes: true,
  turbopack: {
    // The repository root, not this folder: the site renders philcn straight
    // from `../src`, and Turbopack refuses to read above the root it is given.
    root: fileURLToPath(new URL("..", import.meta.url)),
  },
};

export default config;
