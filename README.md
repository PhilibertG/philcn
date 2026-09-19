# philcn

A React component library written from scratch.

The API is deliberately compatible with shadcn/ui so that any component or
block can be moved over by changing a single import line. The implementation
is entirely original — no third-party component library is used, and no code
is copied from another project.

Like shadcn/ui, philcn is not a package you install. The CLI copies source
files into your project, where they become yours to edit.

## Status

35 components, covering the simple ones, the overlays, the floating panels and
the keyboard-driven groups. Design tokens for light and dark themes, and one
production dependency: `@floating-ui/react-dom`, a pure positioning
calculator.

Released versions and their changelog live on the
[releases page](https://github.com/PhilibertG/philcn/releases).

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
