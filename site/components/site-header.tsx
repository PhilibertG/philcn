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
          ? "bg-brand-ink text-white shadow-[0_2px_10px_-2px_rgba(17,18,22,.45)]"
          : "border border-brand-line bg-white text-brand-ink"
      }`}
    >
      {children}
      <span
        className={`grid size-9 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${
          dark ? "bg-brand-primary text-white" : "bg-brand-ink text-white"
        }`}
        aria-hidden
      >
        →
      </span>
    </a>
  );
}

/** The navigation, which lives inside the hero card rather than above it. */
export function SiteHeader() {
  return (
    <div className="flex items-center gap-10 px-7 pt-6 sm:px-10">
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

      <div className="ml-auto">
        <PillLink href="#library">Get started</PillLink>
      </div>
    </div>
  );
}
