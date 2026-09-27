import AccordionDefault from "@/examples/accordion/default";
import AccordionMultiple from "@/examples/accordion/multiple";
import AlertDefault from "@/examples/alert/default";
import BreadcrumbDefault from "@/examples/breadcrumb/default";
import CardDefault from "@/examples/card/default";
import TableDefault from "@/examples/table/default";
import TabsDefault from "@/examples/tabs/default";
import TabsManual from "@/examples/tabs/manual";
import type { Doc } from "@/lib/docs";

/** What holds the rest of it together. */
export const layout: Record<string, Doc> = {
  card: {
    slug: "card",
    title: "Card",
    summary: "A box with a top, a middle and a bottom.",
    description:
      "Seven pieces you arrange yourself rather than props you configure: a header with its title and description, an action in the corner of that header, the content, and a footer. Use the ones you need and leave out the rest.",
    element: "div",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Header with an action, a field in the middle, two buttons at the foot.",
        Component: CardDefault,
      },
    ],
    props: [],
    notes: [
      "CardAction sits in the top right of the header, beside the title, without being told to: the header's own grid puts it there.",
    ],
  },

  table: {
    slug: "table",
    title: "Table",
    summary: "Rows and columns, and nothing more.",
    description:
      "A real <table> wearing the theme — header, body, footer, caption. There is no sorting, no paging and no virtual scrolling here: it draws the data you hand it, which keeps it useful for the nine tables out of ten that need nothing else.",
    element: "table",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "A caption, three rows, and a footer that sums them up.",
        Component: TableDefault,
      },
    ],
    props: [],
    notes: [
      "Keep the caption: it is the one line telling a screen reader what the table is, before it starts reading cells.",
      "A table wider than its column scrolls sideways inside its own wrapper rather than stretching the page.",
    ],
  },

  tabs: {
    slug: "tabs",
    title: "Tabs",
    summary: "Panels that share one space.",
    description:
      "Tab reaches the row of tabs once, and the arrow keys move between them — that is what makes it a tab row rather than a row of buttons. By default moving also opens the panel; ask for manual activation and the reader has to say so.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Three tabs, one of them disabled. Arrows move, and the panel follows.",
        Component: TabsDefault,
      },
      {
        id: "manual",
        title: "Manual activation",
        description: "The arrows move the focus; Enter or Space opens the panel.",
        Component: TabsManual,
      },
    ],
    props: [
      { component: "Tabs", name: "value", description: "Controlled: the open tab." },
      { component: "Tabs", name: "onValueChange", description: "Called with the tab that was just opened." },
      {
        component: "Tabs",
        name: "activationMode",
        description:
          "Automatic opens a panel as the focus lands on its tab; manual waits for Enter or Space. Manual when opening costs a request.",
      },
      { component: "Tabs", name: "orientation", description: "A row of tabs, or a column down the side." },
      { component: "TabsTrigger", name: "value", description: "Ties this tab to its panel. Required." },
      { component: "TabsContent", name: "value", description: "Ties this panel to its tab. Required." },
      {
        component: "TabsContent",
        name: "forceMount",
        description: "Keeps the panel in the page while it is hidden, for something expensive to build twice.",
      },
    ],
  },

  accordion: {
    slug: "accordion",
    title: "Accordion",
    summary: "Sections that fold away.",
    description:
      "One open at a time, or as many as the reader likes. The panel slides from nothing to its real height, which is measured as it opens and watched afterwards, so a panel whose content grows does not end up clipped.",
    examples: [
      {
        id: "default",
        title: "One at a time",
        description: "Opening one closes the last. `collapsible` lets the open one close again.",
        Component: AccordionDefault,
      },
      {
        id: "multiple",
        title: "Several at once",
        description: "Every section independent; the value is an array.",
        Component: AccordionMultiple,
      },
    ],
    props: [
      {
        component: "Accordion",
        name: "type",
        description: 'Required. `"single"` for one open section, `"multiple"` for any number.',
      },
      { component: "Accordion", name: "value", description: "Controlled. A string, or an array when multiple." },
      { component: "Accordion", name: "onValueChange", description: "Called whenever a section opens or closes." },
      { component: "AccordionItem", name: "value", description: "What this section is called, internally. Required." },
      { component: "AccordionItem", name: "disabled", description: "This section cannot be opened." },
      {
        component: "AccordionContent",
        name: "forceMount",
        description: "Keeps the panel in the page while it is closed, when its content is expensive to build.",
      },
    ],
    notes: [
      "Unlike tabs, every header stays in the tab order: that is the rule for accordions, and the reason this one does not use the roving focus the other groups share.",
      "`collapsible` is what lets the single open section be closed again, leaving nothing open.",
    ],
  },

  breadcrumb: {
    slug: "breadcrumb",
    title: "Breadcrumb",
    summary: "Where this page sits.",
    description:
      "The trail from the front page to here. The last item is the page you are on, so it is not a link — and it is marked as current, which is what a screen reader announces.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "With the middle collapsed into an ellipsis, for a deep trail.",
        Component: BreadcrumbDefault,
      },
    ],
    props: [
      { component: "BreadcrumbLink", name: "href", description: "Where this step goes." },
      {
        component: "BreadcrumbLink",
        name: "asChild",
        description: "Hands the styling to your own link component — Next's, or your router's.",
      },
    ],
    notes: [
      "The separators are hidden from screen readers: a list of links read out with a slash between each pair helps nobody.",
    ],
  },

  alert: {
    slug: "alert",
    title: "Alert",
    summary: "Something the reader should know before carrying on.",
    description:
      "A line of explanation that stays on the page, as opposed to a dialog, which stops it. Put the icon first, then a title short enough to be read at a glance, then what to do about it.",
    element: "div",
    examples: [
      {
        id: "default",
        title: "Default and destructive",
        description: "One that informs, one that warns.",
        Component: AlertDefault,
      },
    ],
    props: [
      {
        component: "Alert",
        name: "variant",
        description: "Destructive for something that went wrong or is about to; default for the rest.",
      },
    ],
    notes: [
      "An alert that appears after the page has loaded — a failed save, say — should be announced: give it `role=\"alert\"`, and a screen reader will read it out.",
    ],
  },
};
