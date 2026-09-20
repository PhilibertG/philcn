import { GitHubIcon } from "./icons";

const links = [
  { href: "#demo", label: "Components" },
  { href: "#why", label: "Why it exists" },
  { href: "#choices", label: "Choices" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-site-line/70 bg-site-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-6">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-2xl leading-none tracking-tight">philcn</span>
          <span className="rounded-full border border-site-line px-2 py-0.5 font-mono text-[10px] text-site-faint">
            v0.3.0
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-7 text-sm text-site-dim sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-site-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="https://github.com/PhilibertG/philcn"
          className="ml-auto grid size-9 place-items-center rounded-md text-site-dim transition-colors duration-200 hover:bg-site-bg-raised hover:text-site-fg sm:ml-0"
          aria-label="philcn on GitHub"
        >
          <GitHubIcon className="size-[18px]" />
        </a>
      </div>
    </header>
  );
}
