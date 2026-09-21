import { GitHubIcon } from "./icons";

const links = [
  { href: "#library", label: "Components" },
  { href: "#library", label: "Docs" },
  { href: "#why", label: "Themes" },
  { href: "#why", label: "Showcase" },
];

/** The wordmark. The dot is the one fixed piece of the mark. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-[-0.045em] ${className ?? ""}`}>
      philcn<span className="text-brand-primary">.</span>
    </span>
  );
}

/** A black pill with the arrow in its own circle, the way the references do it. */
export function PillLink({
  href,
  children,
  tone = "ink",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "light";
}) {
  const dark = tone === "ink";
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-6 text-[15px] font-medium transition-transform duration-200 hover:-translate-y-px active:translate-y-0 ${
        dark
          ? "bg-white text-brand-ink shadow-[0_2px_14px_-4px_rgba(0,0,0,.6)]"
          : "border border-white/20 bg-white/8 text-white backdrop-blur-sm"
      }`}
    >
      {children}
      <span
        className={`grid size-9 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${
          dark ? "bg-brand-primary text-white" : "bg-white text-brand-ink"
        }`}
        aria-hidden
      >
        →
      </span>
    </a>
  );
}

/**
 * The navigation, pinned to the top of the window.
 *
 * It floats over whatever is under it — the ink hero, then the light cards —
 * so it carries its own dark, blurred bar rather than borrowing a background
 * from the section behind it. That way it stays readable the whole way down.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-2 top-2 z-50 sm:inset-x-3 sm:top-3">
      <div className="flex items-center gap-10 rounded-[20px] border border-white/10 bg-[#0A0B0F]/72 px-6 py-3 backdrop-blur-xl lg:px-20">
        <a href="#top" className="shrink-0">
          <Wordmark className="text-[22px] text-white" />
        </a>

        <nav className="hidden items-center gap-8 text-[15px] text-white/55 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/PhilibertG/philcn"
            className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
          >
            <GitHubIcon className="size-[17px]" />
            GitHub
          </a>
        </nav>

        <div className="ml-auto">
          <PillLink href="#library">Get started</PillLink>
        </div>
      </div>
    </header>
  );
}
