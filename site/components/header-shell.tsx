"use client";

import * as React from "react";

/**
 * The part of the header that knows the page has moved.
 *
 * At the top of the page the bar runs the full width, with a dark translucent
 * fill of its own so its links stay readable over the brightest beams. It is
 * set into the hero card like a card within a card: the same gap above it as
 * beside it (16px on a phone, 20px beyond), and a radius of the card's minus
 * that gap, so the two curves stay parallel instead of colliding. Once
 * the reader scrolls, it draws in to a capsule the width of the content,
 * closer to the top edge, darker and lifted by a shadow.
 * The change marks that the hero is behind you without taking any room.
 *
 * The timing lives in globals.css, under .nav-bar: going in and coming out
 * run on different curves, which utility classes cannot express. So do the
 * radii of the button inside, which follow the bar's to stay concentric.
 *
 * The capsule's radius is a real length, not rounded-full: that one resolves
 * to millions of pixels, and a transition from zero would snap fully round on
 * its first frame instead of forming. The rest of the header stays a server component;
 * only this wrapper listens to the scroll.
 */
export function HeaderShell({
  children,
  /**
   * Whether the bar draws in to a capsule once the page scrolls. True on the
   * home page, where the shape marks that the hero is behind you. False on a
   * page that is read rather than looked at: there the bar stays a plain
   * strip across the top, out of the way.
   */
  shrinkOnScroll = true,
}: {
  children: React.ReactNode;
  shrinkOnScroll?: boolean;
}) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!shrinkOnScroll) return;
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [shrinkOnScroll]);

  if (!shrinkOnScroll) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0A0B0F]/85 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-10 py-1.5 pr-3 pl-6 lg:pl-8">{children}</div>
      </header>
    );
  }

  return (
    <header
      data-scrolled={scrolled}
      className="nav-shell group/header fixed inset-x-0 top-6 z-50 px-6 data-[scrolled=true]:top-3 sm:top-8 sm:px-8 sm:data-[scrolled=true]:top-3"
    >
      <div className="nav-bar mx-auto flex max-w-full items-center gap-10 rounded-[16px] border border-white/10 bg-[#0A0B0F]/70 py-1.5 pr-1.5 pl-7 group-data-[scrolled=true]/header:max-w-content group-data-[scrolled=true]/header:rounded-[31px] group-data-[scrolled=true]/header:border-white/10 group-data-[scrolled=true]/header:bg-[#0A0B0F]/85 group-data-[scrolled=true]/header:shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)] backdrop-blur-xl lg:pl-10">
        {children}
      </div>
    </header>
  );
}
