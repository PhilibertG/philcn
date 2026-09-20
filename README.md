# philcn

A React component library written from scratch.

The API is deliberately compatible with shadcn/ui so that any component or
block can be moved over by changing a single import line. The implementation
is entirely original — no third-party component library is used, and no code
is copied from another project.

Like shadcn/ui, philcn is not a package you install. The CLI copies source
files into your project, where they become yours to edit.

## Status

40 components, covering the simple ones, the overlays, the floating panels,
the keyboard-driven groups, the form controls and a form wrapper — plus a `philcn` command
that copies any of them into your own project. Design tokens for light and dark themes, and one
production dependency: `@floating-ui/react-dom`, a pure positioning
calculator.

Released versions and their changelog live on the
[releases page](https://github.com/PhilibertG/philcn/releases).

## How it is built

The reasoning behind the library — what it depends on and why, what it
deliberately does differently, and how the shared behaviour is factored — is
written down in [docs/DECISIONS.md](docs/DECISIONS.md).

## Releases

Versions are cut by a robot, not by hand. Every commit carries a conventional
commit label; a permanent release pull request tracks the next version number
and its changelog, and merging that pull request is what tags the version and
publishes the notes. Nothing reaches anyone before that merge.

The process, and how to run the commit check locally, is described in
[docs/RELEASE.md](docs/RELEASE.md).

## Requirements

- React 18 or later
- Tailwind CSS 4

## Development

```bash
npm install
npm run check      # typecheck + tests
```

## License

MIT © Philibert Gentien
