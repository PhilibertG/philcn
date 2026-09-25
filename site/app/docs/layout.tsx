import { SidebarNav } from "@/components/docs/sidebar-nav";
import { SiteHeader } from "@/components/site-header";
import { slugs } from "@/content/docs";

/**
 * The documentation shell: the site's own navigation on top, the list of
 * components down the left, the page in the middle.
 *
 * Reading is the job here, so this side of the site is light and quiet —
 * the ink page and its shader belong to the home page.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-brand-surface text-brand-ink">
      <SiteHeader shrinkOnScroll={false} />
      {/* A page that is read, not looked at: thin gutters, the list of
          components against the left edge, and the text taking the room it
          needs rather than sitting in the middle of a wide empty page. */}
      {/* The same gutter as the navigation's wordmark, so the list of
          components starts on the line the name starts on. */}
      <div className="flex gap-10 px-6 lg:gap-14 lg:px-8">
        {/* The list is held against the top of the window for the whole page.
            Its own bottom padding, rather than the page's, keeps the last
            entry off the edge — page padding would push the whole list up
            once the end of the page came into view. */}
        {/* data-lenis-prevent: the smooth scrolling of the page never takes
            this list's wheel, and reaching either end of the list stops
            there instead of carrying on down the page. */}
        <aside
          data-lenis-prevent
          className="quiet-scroll sticky top-16 -ml-2 hidden h-[calc(100dvh-4rem)] w-[248px] shrink-0 overflow-y-auto py-8 pl-2 lg:block"
        >
          {/* Installation has a page of its own, outside the component pages. */}
          <SidebarNav written={[...slugs, "installation"]} />
        </aside>
        <main className="min-w-0 flex-1 pt-24 pb-24">{children}</main>
      </div>
    </div>
  );
}
