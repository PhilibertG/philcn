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
      <div className="flex gap-10 px-6 pt-24 pb-24 lg:gap-14 lg:px-10 xl:px-14">
        <aside className="sticky top-24 hidden h-[calc(100dvh-7rem)] w-56 shrink-0 overflow-y-auto pb-8 lg:block">
          <SidebarNav written={slugs} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
