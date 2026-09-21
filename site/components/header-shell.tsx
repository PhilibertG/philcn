"use client";

import * as React from "react";

/**
 * The part of the header that knows the page has moved.
 *
 * Once the reader scrolls past the top, the bar draws in: narrower, closer to
 * the top edge, darker and lifted by a shadow. It marks that the hero is behind
 * you without taking any room. The rest of the header stays a server component;
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
      className="group/header fixed inset-x-0 top-5 z-50 px-3 transition-[top] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[scrolled=true]:top-3 motion-reduce:transition-none sm:top-6 sm:px-4"
    >
      <div className="mx-auto flex max-w-[1760px] items-center gap-10 rounded-full border border-white/10 bg-[#0A0B0F]/60 py-2 pr-2 pl-7 backdrop-blur-xl transition-[max-width,background-color,box-shadow,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[scrolled=true]/header:max-w-[1040px] group-data-[scrolled=true]/header:bg-[#0A0B0F]/85 group-data-[scrolled=true]/header:py-1.5 group-data-[scrolled=true]/header:shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)] motion-reduce:transition-none lg:pl-10">
        {children}
      </div>
    </header>
  );
}
