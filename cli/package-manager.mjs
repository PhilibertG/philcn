/**
 * Which package manager the project uses, and how to talk to it.
 *
 * Telling a pnpm user to run `npm install` is a small thing that makes a tool
 * feel foreign. The manager is worked out from the one that invoked us, and
 * failing that from the lockfile lying in the project.
 */

/** In the order they are looked for. */
export const MANAGERS = ["bun", "pnpm", "yarn", "npm"];

const LOCKFILES = {
  bun: ["bun.lock", "bun.lockb"],
  pnpm: ["pnpm-lock.yaml"],
  yarn: ["yarn.lock"],
  npm: ["package-lock.json"],
};

/**
 * Reads the manager out of the string npm, pnpm, yarn and bun all set when
 * they run a script: "pnpm/9.1.0 npm/? node/v22.0.0 linux x64".
 */
export function fromUserAgent(agent) {
  if (typeof agent !== "string" || agent.length === 0) return null;
  const name = agent.split("/")[0]?.trim().toLowerCase();
  return name !== undefined && MANAGERS.includes(name) ? name : null;
}

/** Reads the manager off the lockfile the project carries. */
export function fromLockfiles(exists) {
  for (const manager of MANAGERS) {
    for (const file of LOCKFILES[manager]) {
      if (exists(file)) return manager;
    }
  }
  return null;
}

/** The manager to address, falling back to npm when nothing says otherwise. */
export function detect({ agent, exists } = {}) {
  return fromUserAgent(agent) ?? fromLockfiles(exists ?? (() => false)) ?? "npm";
}

/** How this manager is told to add packages. */
export function addCommand(manager, packages) {
  const list = packages.join(" ");
  if (manager === "npm") return `npm install ${list}`;
  return `${manager} add ${list}`;
}

/** How this manager runs a command it has not installed. */
export function runCommand(manager, command) {
  if (manager === "bun") return `bunx ${command}`;
  if (manager === "pnpm") return `pnpm dlx ${command}`;
  if (manager === "yarn") return `yarn dlx ${command}`;
  return `npx ${command}`;
}
