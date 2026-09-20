import { GitHubIcon } from "./icons";

const links = [
  { href: "#library", label: "Components" },
  { href: "#library", label: "Docs" },
  { href: "#values", label: "Themes" },
  { href: "#library", label: "Showcase" },
];

/** The wordmark. The dot is the one fixed piece of the mark. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-[-0.045em] ${className ?? ""}`}>
      philcn<span className="text-brand-primary">.</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/70 bg-brand-canvas/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-10 px-6">
        <a href="#top" className="shrink-0">
          <Wordmark className="text-[22px]" />
        </a>

        <nav className="hidden items-center gap-8 text-[15px] text-brand-ink-soft lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/PhilibertG/philcn"
            className="flex items-center gap-2 transition-colors duration-200 hover:text-brand-ink"
          >
            <GitHubIcon className="size-[17px]" />
            GitHub
          </a>
        </nav>

        <a
          href="#library"
          className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-brand-ink px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(17,18,22,.28)] transition-transform duration-200 hover:-translate-y-px active:translate-y-0"
        >
          Get started
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
