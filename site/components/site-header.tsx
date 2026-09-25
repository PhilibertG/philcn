import { HeaderShell } from "./header-shell";
import { GitHubIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/docs/button", label: "Components" },
  { href: "/docs/button", label: "Docs" },
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

/**
 * A black pill with the arrow in its own circle, the way the references do it.
 * Inside the navigation it takes the bar's shape instead (see .nav-bar .pill
 * in globals.css). Only the arrow turns on hover, so a squared mark does not
 * spin into a diamond.
 */
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
      className={`pill group inline-flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-6 text-[15px] font-medium transition-transform duration-200 hover:-translate-y-px active:translate-y-0 ${
        dark
          ? "bg-white text-[#111216] shadow-[0_2px_14px_-4px_rgba(0,0,0,.6)]"
          : "border border-white/20 bg-white/8 text-white backdrop-blur-sm"
      }`}
    >
      {children}
      <span
        className={`pill-mark grid size-9 place-items-center rounded-full ${
          dark ? "bg-brand-primary text-white" : "bg-white text-[#111216]"
        }`}
        aria-hidden
      >
        <span className="inline-block transition-transform duration-300 group-hover:rotate-45">→</span>
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
export function SiteHeader({ shrinkOnScroll = true }: { shrinkOnScroll?: boolean }) {
  return (
    <HeaderShell shrinkOnScroll={shrinkOnScroll}>
      {/* On the home page the wordmark rides back to the top; anywhere else
          it is the way home. */}
      <a href={shrinkOnScroll ? "#top" : "/"} className="shrink-0">
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

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <PillLink href="#library">Get started</PillLink>
      </div>
    </HeaderShell>
  );
}
