# philcn

A React component library written from scratch.

The API is deliberately compatible with shadcn/ui so that any component or
block can be moved over by changing a single import line. The implementation
is entirely original — no third-party component library is used, and no code
is copied from another project.

Like shadcn/ui, philcn is not a package you install. The CLI copies source
files into your project, where they become yours to edit.

## Usage

Set the project up once:

```bash
bunx philcn init          # bun
pnpm dlx philcn init      # pnpm
yarn dlx philcn init      # yarn
npx philcn init           # npm
```

`init` writes a `components.json`, drops the theme stylesheet into the project
and creates `lib/utils.ts` — the same file shadcn uses, holding `cn`. Import
the stylesheet once, then add what you need:

```bash
npx philcn list                    # everything on offer
npx philcn add button card         # copy those in
```

The stylesheet opens with two imports, and both matter:

```css
@import "tailwindcss";
@import "philcn/source.css";
```

The second tells Tailwind to look inside the installed package. Some of the
shared behaviour carries Tailwind classes, and Tailwind does not scan
`node_modules` on its own — without that line, menus and dialogs come out
unstyled. `init` writes it for you; a project set up with philcn 0.3.0 has to
add it by hand.


Each component lands in your own source tree as a file you own, with its
imports rewritten to your aliases. The shared behaviour behind it — focus
traps, portals, keyboard navigation — is imported from the `philcn` package
rather than copied, the same way a shadcn component imports Radix. So a project
using philcn looks like this, and nothing else:

```
components/ui/button.tsx
components/ui/dialog.tsx
lib/utils.ts
```

The command tells you which packages to install, in your own package manager's
wording.

### Carrying all of the code

If a project has to hold every line it runs — a school submission, an audit —
`--standalone` copies the shared behaviour as files too, so nothing is imported
from `philcn` at runtime:

```bash
npx philcn add dialog --standalone
```

## Status

40 components: the simple ones, the overlays, the floating panels, the
keyboard-driven groups, the form controls and a form wrapper — plus design
tokens for light and dark themes.

Two dependencies, both optional, installed only if you use the components that
need them: `@floating-ui/react-dom` for anything that floats, and
`react-hook-form` for `Form`. Neither draws anything.

Released versions and their changelog live on the
[releases page](https://github.com/PhilibertG/philcn/releases).

## Releases

Versions are cut by a robot, not by hand. Every commit carries a conventional
commit label; a permanent release pull request tracks the next version number
and its changelog, and merging that pull request is what tags the version and
publishes the notes. Nothing reaches anyone before that merge.

The commit format is checked on every pull request:

```bash
node scripts/check-commits.mjs origin/main..HEAD
```

## Requirements

- React 18 or later
- Tailwind CSS 4
- Node 18 or later, for the command

## Development

```bash
npm install
npm run check      # typecheck + tests
```

## License

MIT © Philibert Gentien
