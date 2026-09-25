/**
 * Every component the library ships, in the order the sidebar shows them.
 *
 * A component appears here as soon as it exists, whether or not its page is
 * written: a reader looking for Tooltip should find it listed, and see that
 * its page is still to come, rather than wonder whether it exists at all.
 * The pages that are written are the keys of `docs` in ./docs.ts.
 */
export type Group = { title: string; items: { slug: string; title: string }[] };

export const groups: Group[] = [
  {
    title: "Getting started",
    items: [
      { slug: "installation", title: "Installation" },
    ],
  },
  {
    title: "Basics",
    items: [
      { slug: "button", title: "Button" },
      { slug: "badge", title: "Badge" },
      { slug: "avatar", title: "Avatar" },
      { slug: "kbd", title: "Kbd" },
      { slug: "separator", title: "Separator" },
      { slug: "skeleton", title: "Skeleton" },
      { slug: "spinner", title: "Spinner" },
      { slug: "progress", title: "Progress" },
      { slug: "aspect-ratio", title: "Aspect Ratio" },
      { slug: "empty", title: "Empty" },
    ],
  },
  {
    title: "Forms",
    items: [
      { slug: "input", title: "Input" },
      { slug: "textarea", title: "Textarea" },
      { slug: "label", title: "Label" },
      { slug: "checkbox", title: "Checkbox" },
      { slug: "switch", title: "Switch" },
      { slug: "radio-group", title: "Radio Group" },
      { slug: "select", title: "Select" },
      { slug: "slider", title: "Slider" },
      { slug: "toggle", title: "Toggle" },
      { slug: "toggle-group", title: "Toggle Group" },
      { slug: "calendar", title: "Calendar" },
      { slug: "form", title: "Form" },
    ],
  },
  {
    title: "Layout",
    items: [
      { slug: "card", title: "Card" },
      { slug: "table", title: "Table" },
      { slug: "tabs", title: "Tabs" },
      { slug: "accordion", title: "Accordion" },
      { slug: "breadcrumb", title: "Breadcrumb" },
      { slug: "alert", title: "Alert" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { slug: "dialog", title: "Dialog" },
      { slug: "alert-dialog", title: "Alert Dialog" },
      { slug: "sheet", title: "Sheet" },
      { slug: "drawer", title: "Drawer" },
      { slug: "popover", title: "Popover" },
      { slug: "tooltip", title: "Tooltip" },
      { slug: "hover-card", title: "Hover Card" },
      { slug: "command", title: "Command" },
    ],
  },
  {
    title: "Menus",
    items: [
      { slug: "dropdown-menu", title: "Dropdown Menu" },
      { slug: "context-menu", title: "Context Menu" },
      { slug: "menubar", title: "Menubar" },
      { slug: "navigation-menu", title: "Navigation Menu" },
    ],
  },
];
