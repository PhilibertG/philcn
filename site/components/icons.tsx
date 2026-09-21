/**
 * The icons the site uses, drawn here rather than pulled from a package.
 * philcn takes no icon library as a dependency, and neither does its site.
 */
type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M5 12h13M12.5 6l6 6-6 6" />
    </svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M13.5 2 4 13.5h6.5L10 22l9.5-11.5H13L13.5 2Z" />
    </svg>
  );
}

export function KeyboardIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M8 14h8" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
    </svg>
  );
}

export function ReactIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        <ellipse cx="12" cy="12" rx="9.5" ry="3.7" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

export function TailwindIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M7 10.2c.67-2.67 2.33-4 5-4 4 0 4.5 3 6.5 3.5 1.33.33 2.5-.17 3.5-1.5-.67 2.67-2.33 4-5 4-4 0-4.5-3-6.5-3.5-1.33-.33-2.5.17-3.5 1.5Zm-5 6c.67-2.67 2.33-4 5-4 4 0 4.5 3 6.5 3.5 1.33.33 2.5-.17 3.5-1.5-.67 2.67-2.33 4-5 4-4 0-4.5-3-6.5-3.5-1.33-.33-2.5.17-3.5 1.5Z" />
    </svg>
  );
}

export function TypeScriptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <rect width="24" height="24" rx="4" fill="currentColor" />
      <path
        d="M13.1 18.6v-2.1c.5.4 1.3.7 2 .7.8 0 1.2-.3 1.2-.8 0-.4-.3-.7-1.2-1.1-1.5-.6-2.2-1.3-2.2-2.5 0-1.5 1.2-2.5 3-2.5.8 0 1.5.1 2 .3v2c-.5-.3-1.1-.5-1.8-.5-.7 0-1.1.3-1.1.7 0 .4.3.6 1.3 1.1 1.4.6 2.1 1.3 2.1 2.5 0 1.6-1.2 2.5-3.1 2.5-.9 0-1.7-.1-2.2-.3ZM6 12.2h2.3v6.6h2v-6.6h2.3v-1.8H6v1.8Z"
        fill="#fff"
      />
    </svg>
  );
}
