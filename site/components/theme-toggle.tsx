"use client";

import * as React from "react";

/**
 * The light/dark switch.
 *
 * It puts a `dark` class on the page, which is the same switch philcn's own
 * components watch — so the components in the documentation are not a picture
 * of a dark theme, they are the real thing in it.
 *
 * The choice is remembered in the browser it was made in. Until something is
 * chosen, the page follows the system setting.
 */
export function ThemeToggle() {
  const [dark, setDark] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("philcn-theme", next ? "dark" : "light");
    } catch {
      // A browser that refuses storage still gets the change, just not the memory.
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark ?? false}
      aria-label={dark ? "Switch to the light theme" : "Switch to the dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="grid size-9 cursor-pointer place-items-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:ring-[3px] focus-visible:ring-white/30 focus-visible:outline-none"
    >
      {/* Sun and moon, drawn here rather than imported: two paths are cheaper
          than a dependency. */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
        {dark ? (
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  );
}

/**
 * Runs before the page is painted, so a reader who chose dark never sees a
 * white flash first. It is inline on purpose: a separate file would arrive
 * too late.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem("philcn-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;
