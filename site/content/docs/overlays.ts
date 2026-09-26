import AlertDialogDefault from "@/examples/alert-dialog/default";
import CommandDefault from "@/examples/command/default";
import CommandInDialog from "@/examples/command/dialog";
import DrawerDefault from "@/examples/drawer/default";
import DrawerSide from "@/examples/drawer/side";
import HoverCardDefault from "@/examples/hover-card/default";
import PopoverDefault from "@/examples/popover/default";
import PopoverPlacement from "@/examples/popover/placement";
import SheetSides from "@/examples/sheet/sides";
import TooltipDefault from "@/examples/tooltip/default";
import DialogDefault from "@/examples/dialog/default";
import DialogWithForm from "@/examples/dialog/with-form";
import DialogWithoutCloseButton from "@/examples/dialog/without-close-button";
import type { Doc } from "@/lib/docs";

/** Windows that come over the page. */
export const overlays: Record<string, Doc> = {
  dialog: {
    slug: "dialog",
    title: "Dialog",
    summary: "A window over the page, for something that needs answering.",
    description:
      "The page behind is frozen and hidden from screen readers, focus is trapped inside and returns to whatever opened the dialog, Escape closes, and a dialog taller than the window scrolls inside itself instead of running off the bottom.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "A title, a sentence, and two buttons. The smallest dialog worth having.",
        Component: DialogDefault,
      },
      {
        id: "with-form",
        title: "With a form",
        description: "Focus lands on the field, and Tab cycles inside the dialog while it is open.",
        Component: DialogWithForm,
      },
      {
        id: "without-close-button",
        title: "Without the corner cross",
        description: "For a decision that should be answered rather than dismissed.",
        Component: DialogWithoutCloseButton,
      },
    ],
    props: [
      { component: "Dialog", name: "open", description: "Controlled: you hold whether it is open." },
      {
        component: "Dialog",
        name: "defaultOpen",
        description: "Uncontrolled: the dialog holds its own state and starts like this.",
      },
      { component: "Dialog", name: "onOpenChange", description: "Called whenever it opens or closes." },
      {
        component: "Dialog",
        name: "modal",
        description: "A modal dialog freezes the page behind it. Turn it off and the page stays usable.",
      },
      {
        component: "DialogContent",
        name: "showCloseButton",
        description: "The cross in the corner. Escape closes the dialog either way.",
      },
    ],
    notes: [
      "Give every dialog a DialogTitle: it is what a screen reader announces when the dialog opens.",
      "When a dialog opens over another, the one underneath stays open but is made inert — invisible to screen readers and out of the way of the keyboard.",
    ],
  },

  "alert-dialog": {
    slug: "alert-dialog",
    title: "Alert Dialog",
    summary: "A question that has to be answered.",
    description:
      "A dialog the reader cannot wave away: no corner cross, and clicking the darkened page does nothing. Keep it for what cannot be undone — deleting, publishing, paying — and use a plain Dialog for everything else.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Two ways out, and both of them are decisions.",
        Component: AlertDialogDefault,
      },
    ],
    props: [
      { component: "AlertDialog", name: "open", description: "Controlled: whether it is showing." },
      { component: "AlertDialog", name: "defaultOpen", description: "Uncontrolled: whether it starts open." },
      { component: "AlertDialog", name: "onOpenChange", description: "Called when it opens or closes." },
      {
        component: "AlertDialogContent",
        name: "onEscapeKeyDown",
        description: "Escape still closes it. Call preventDefault here if even that should be a decision.",
      },
    ],
    notes: [
      "The cancel button takes focus when it opens, not the destructive one: a reader hitting Enter out of habit should keep their data.",
      "Name the action after what it does — Delete, Publish — rather than OK. A reader reads the button, not the paragraph.",
    ],
  },

  sheet: {
    slug: "sheet",
    title: "Sheet",
    summary: "A panel from the edge of the window.",
    description:
      "A dialog that arrives from a side instead of the middle, for something with a shape of its own: a form, a filter panel, a navigation menu on a phone. It behaves like a dialog in every other way — focus trapped, Escape closes, the page behind frozen.",
    examples: [
      {
        id: "sides",
        title: "The four sides",
        description: "Right by default. Bottom is the one that reads well on a phone.",
        Component: SheetSides,
      },
    ],
    props: [
      { component: "Sheet", name: "open", description: "Controlled: whether it is showing." },
      { component: "Sheet", name: "onOpenChange", description: "Called when it opens or closes." },
      { component: "Sheet", name: "modal", description: "Modal freezes the page behind it. Off, and the page stays usable." },
      { component: "SheetContent", name: "side", description: "Which edge it comes from." },
      { component: "SheetContent", name: "showCloseButton", description: "The cross in the corner." },
    ],
  },

  drawer: {
    slug: "drawer",
    title: "Drawer",
    summary: "A panel you can throw back with your thumb.",
    description:
      "A sheet that answers to a finger: the panel follows the drag, resists when pulled the wrong way, and closes on a flick or past a quarter of its height. shadcn reaches for vaul here; this one is written by hand, and the rules behind it are tested on their own.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "From the bottom, with a handle. Drag it down to close.",
        Component: DrawerDefault,
      },
      {
        id: "side",
        title: "From a side",
        description: "The direction decides both the edge it comes from and the way it is dragged.",
        Component: DrawerSide,
      },
    ],
    props: [
      { component: "Drawer", name: "open", description: "Controlled: whether it is showing." },
      { component: "Drawer", name: "onOpenChange", description: "Called when it opens or closes." },
      {
        component: "Drawer",
        name: "swipeDirection",
        description: 'Which way it is thrown to close: `"up"`, `"right"`, `"down"` or `"left"`.',
      },
      {
        component: "Drawer",
        name: "direction",
        description: "The older spelling — top, bottom, left, right — kept so earlier code still works.",
      },
      { component: "DrawerContent", name: "showHandle", description: "The bar you grab. On by default." },
    ],
    notes: [
      "The page behind is not scaled down as vaul does it: that would mean transforming a container around the whole application, which is too much for a library you paste into an existing project.",
    ],
  },

  popover: {
    slug: "popover",
    title: "Popover",
    summary: "A small panel anchored to what opened it.",
    description:
      "For a handful of controls that would crowd the page — a width, a date, a filter. It is placed against its trigger and moves out of its own way when the window edge is in the way, flipping to the other side rather than being cut off. It follows the trigger when the page scrolls.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "A title, a sentence, and one field.",
        Component: PopoverDefault,
      },
      {
        id: "placement",
        title: "Placement",
        description: "A preference rather than an order: it flips when there is no room.",
        Component: PopoverPlacement,
      },
    ],
    props: [
      { component: "Popover", name: "open", description: "Controlled: whether it is showing." },
      { component: "Popover", name: "onOpenChange", description: "Called when it opens or closes." },
      { component: "PopoverContent", name: "side", description: "Which side of the trigger it prefers." },
      { component: "PopoverContent", name: "align", description: "How it lines up along that side." },
      { component: "PopoverContent", name: "sideOffset", description: "The gap between trigger and panel, in pixels." },
      {
        component: "PopoverContent",
        name: "avoidCollisions",
        description: "Whether it may move itself to stay on screen. On by default.",
      },
    ],
    notes: [
      "A date picker is a Calendar inside one of these; a combobox is a Command inside one. Neither is a component of its own, here or at shadcn.",
    ],
  },

  tooltip: {
    slug: "tooltip",
    title: "Tooltip",
    summary: "A few words about the thing under the pointer.",
    description:
      "For naming an icon button or spelling out an abbreviation — never for something the reader needs. It appears after a delay, and once one has appeared the next ones come at once, so moving along a toolbar does not stutter.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Three buttons under one provider, sharing its delay.",
        Component: TooltipDefault,
      },
    ],
    props: [
      { component: "TooltipProvider", name: "delayDuration", description: "How long the first tooltip waits." },
      {
        component: "TooltipProvider",
        name: "skipDelayDuration",
        description: "How long the group stays warm, so the next tooltip appears at once.",
      },
      { component: "Tooltip", name: "delayDuration", description: "Overrides the provider's delay for this one." },
      {
        component: "Tooltip",
        name: "disableHoverableContent",
        description: "Closes as soon as the pointer leaves the trigger, instead of letting it travel to the tooltip.",
      },
      { component: "TooltipContent", name: "side", description: "Which side of the trigger it prefers." },
    ],
    notes: [
      "A tooltip cannot be reached by touch. Anything that matters belongs on the page, not in one.",
      "It is tied to its trigger for screen readers, so a button with a tooltip and no text is still named.",
    ],
  },

  "hover-card": {
    slug: "hover-card",
    title: "Hover Card",
    summary: "A preview of what a link leads to.",
    description:
      "Bigger than a tooltip and meant to be entered: the pointer can travel from the link into the card without it closing, so what is inside can be clicked. Keep it to a preview — nothing in it should be the only way to reach something.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Hover the name: the card opens and stays while the pointer is on it.",
        Component: HoverCardDefault,
      },
    ],
    props: [
      { component: "HoverCard", name: "openDelay", description: "How long the pointer must rest before it opens." },
      { component: "HoverCard", name: "closeDelay", description: "How long it waits before closing once the pointer leaves." },
      { component: "HoverCardContent", name: "side", description: "Which side of the trigger it prefers." },
      { component: "HoverCardContent", name: "align", description: "How it lines up along that side." },
    ],
  },

  command: {
    slug: "command",
    title: "Command",
    summary: "Type, and the list narrows.",
    description:
      "A palette written by hand — shadcn uses cmdk, which is not allowed here. The focus stays in the field while the arrow keys move a marker through the list, and the field announces the marked entry, so a screen reader follows. Filtering ignores accents, and the best match is floated to the top without the markup being reordered.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Inline, with groups, a shortcut, and an entry that cannot be chosen.",
        Component: CommandDefault,
      },
      {
        id: "dialog",
        title: "In a dialog",
        description: "The palette over the page, on ⌘K.",
        Component: CommandInDialog,
      },
    ],
    props: [
      { component: "Command", name: "shouldFilter", description: "Turn it off when the results come from a server." },
      { component: "Command", name: "filter", description: "Your own scoring function, if the built-in one is not enough." },
      { component: "Command", name: "value", description: "Controlled: which entry is marked." },
      {
        component: "CommandItem",
        name: "keywords",
        description: "Extra words that should find this entry, without being shown in it.",
      },
      { component: "CommandItem", name: "disabled", description: "Shown, but cannot be chosen." },
      { component: "CommandGroup", name: "heading", description: "The line above the group. A group with nothing left in it hides itself." },
      { component: "CommandDialog", name: "open", description: "Controlled: whether the palette is showing." },
      {
        component: "CommandDialog",
        name: "description",
        description: "What a screen reader is told the palette is for, since the dialog has no visible title.",
      },
    ],
    notes: [
      "A combobox is one of these inside a Popover — the same composition shadcn uses, rather than a component of its own.",
    ],
  },
};
