"use client";

import * as React from "react";

/**
 * The part of the header that knows the page has moved.
 *
 * At the top of the page the bar is part of the hero: full width, square, no
 * background of its own. Once the reader scrolls, it draws in to a capsule the
 * width of the content, closer to the top edge, darker and lifted by a shadow.
 * The change marks that the hero is behind you without taking any room.
 *
 * The timing lives in globals.css, under .nav-bar: going in and coming out
 * run on different curves, which utility classes cannot express.
 *
 * The capsule's radius is a real length, not rounded-full: that one resolves
 * to millions of pixels, and a transition from zero would snap fully round on
 * its first frame instead of forming. The rest of the header stays a server component;
 * only this wrapper listens to the scroll.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="nav-shell group/header fixed inset-x-0 top-5 z-50 px-3 data-[scrolled=true]:top-3 sm:top-6 sm:px-4"
    >
      <div className="nav-bar mx-auto flex max-w-full items-center gap-10 rounded-none border border-transparent bg-transparent py-2 pr-2 pl-7 group-data-[scrolled=true]/header:max-w-content group-data-[scrolled=true]/header:rounded-[28px] group-data-[scrolled=true]/header:border-white/10 group-data-[scrolled=true]/header:bg-[#0A0B0F]/85 group-data-[scrolled=true]/header:py-1.5 group-data-[scrolled=true]/header:shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)] group-data-[scrolled=true]/header:backdrop-blur-xl lg:pl-10">
        {children}
      </div>
    </header>
  );
}
