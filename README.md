# philcn

A React component library written from scratch.

The API is deliberately compatible with shadcn/ui so that any component or
block can be moved over by changing a single import line. The implementation
is entirely original — no third-party component library is used, and no code
is copied from another project.

Like shadcn/ui, philcn is not a package you install. The CLI copies source
files into your project, where they become yours to edit.

## Status

Phase 0 — foundations. Design tokens and the two class utilities are in place.
No components yet.

## Requirements

- React 18 or later
- Tailwind CSS 4

## Development

```bash
npm install
npm run check      # typecheck + tests
```
