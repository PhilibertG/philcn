"use client";

import * as React from "react";

import { CheckIcon, CopyIcon } from "./icons";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(command).then(() => setCopied(true));
      }}
      className="group flex cursor-pointer items-center gap-3 rounded-lg border border-site-line bg-site-bg-raised/70 py-2.5 pr-3 pl-4 font-mono text-sm text-site-dim transition-colors duration-200 hover:border-site-accent/50 hover:text-site-fg focus-visible:border-site-accent focus-visible:outline-none"
      aria-label={copied ? "Command copied" : `Copy ${command}`}
    >
      <span aria-hidden className="text-site-accent">
        $
      </span>
      <span className="text-site-fg">{command}</span>
      <span className="ml-1 grid size-7 place-items-center rounded-md text-site-faint transition-colors duration-200 group-hover:bg-site-accent/15 group-hover:text-site-accent">
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      </span>
    </button>
  );
}
