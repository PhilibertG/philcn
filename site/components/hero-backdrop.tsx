"use client";

import * as React from "react";

import { ShaderCanvas } from "./shader-canvas";
import { DEFAULT_HERO_SHADER, HERO_SHADERS, type HeroShaderKey } from "./shaders";

const KEYS = Object.keys(HERO_SHADERS) as HeroShaderKey[];
const STORAGE_KEY = "philcn:hero-shader";

/**
 * The hero background, with the picker still attached.
 *
 * Five candidates are in the page at once so they can be judged where they
 * will live, against the real components, rather than side by side on a swatch
 * sheet. The choice is remembered in this browser only. Once one is chosen the
 * picker comes out and the rest go with it.
 */
export function HeroBackdrop() {
  const [key, setKey] = React.useState<HeroShaderKey>(DEFAULT_HERO_SHADER);

  // Read after mount: the server has no way to know what this browser chose,
  // and reading during render would make the two disagree.
  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null && saved in HERO_SHADERS) setKey(saved as HeroShaderKey);
    } catch {
      // Private window, or storage turned off. The default stands.
    }
  }, []);

  const choose = (next: HeroShaderKey) => {
    setKey(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Nothing to do: the choice simply will not outlive this page.
    }
  };

  const shader = HERO_SHADERS[key];
  if (shader === undefined) return null;

  return (
    <>
      <ShaderCanvas
        fragment={shader.fragment}
        fallback={shader.fallback}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="absolute bottom-5 left-6 z-20 max-w-[min(30rem,calc(100%-3rem))]">
        <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-brand-line bg-white/75 p-1.5 shadow-[0_8px_24px_-12px_rgba(17,18,22,.28)] backdrop-blur-md">
          <span className="px-2.5 font-mono text-[10px] tracking-widest text-brand-ink-soft uppercase">
            Backdrop
          </span>
          {KEYS.map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => choose(candidate)}
              aria-pressed={candidate === key}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-[13px] transition-colors duration-200 ${
                candidate === key
                  ? "bg-brand-ink text-white"
                  : "text-brand-ink-soft hover:bg-brand-soft hover:text-brand-ink"
              }`}
            >
              {HERO_SHADERS[candidate]?.name}
            </button>
          ))}
        </div>
        <p className="mt-2 pl-3 text-[13px] text-brand-ink-soft">{shader.note}</p>
      </div>
    </>
  );
}
