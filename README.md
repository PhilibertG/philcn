# philcn

A React component library written from scratch.

The API is deliberately compatible with shadcn/ui so that any component or
block can be moved over by changing a single import line. The implementation
is entirely original — no third-party component library is used, and no code
is copied from another project.

Like shadcn/ui, philcn is not a package you install. The CLI copies source
files into your project, where they become yours to edit.

## Usage

Set the project up once, then add what you need. Use whichever package manager
the project already uses:

```bash
bunx philcn init          # bun
pnpm dlx philcn init      # pnpm
yarn dlx philcn init      # yarn
npx philcn init           # npm
```

`init` writes a `components.json` and drops the theme stylesheet into the
project. Import that stylesheet once, then:

```bash
npx philcn list                    # everything on offer
npx philcn add button card         # copy those in, with whatever they need
```

Each component lands in your own source tree with its imports rewritten to
your aliases. It is your file from then on. The command tells you, in your
package manager's own wording, if a component needs a package installed.

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
