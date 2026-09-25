import ButtonAsLink from "@/examples/button/as-link";
import ButtonSizes from "@/examples/button/sizes";
import ButtonVariants from "@/examples/button/variants";
import DialogDefault from "@/examples/dialog/default";
import DialogWithForm from "@/examples/dialog/with-form";
import DialogWithoutCloseButton from "@/examples/dialog/without-close-button";
import SelectControlled from "@/examples/select/controlled";
import SelectDefault from "@/examples/select/default";
import SelectGrouped from "@/examples/select/grouped";
import type { Doc } from "@/lib/docs";

/**
 * The pages that are written. A component missing from here is still listed
 * in the sidebar, marked as not documented yet.
 *
 * Everything mechanical — the type of a prop, whether it is required, the
 * code of an example — is read from the library and from the example files.
 * What is written here is what a machine cannot know: why you would reach
 * for the thing, and what will bite you.
 */
export const docs: Record<string, Doc> = {
  button: {
    slug: "button",
    title: "Button",
    summary: "The one people click.",
    description:
      "Six looks and four sizes, all from the same component. A button gives way slightly when pressed, shows a pointer cursor, and keeps a visible ring when reached with the keyboard — three things a plain <button> does not do on its own.",
    element: "button",
    examples: [
      {
        id: "variants",
        title: "Variants",
        description: "Pick by weight: default for the action you want, ghost for the ones you do not.",
        Component: ButtonVariants,
      },
      {
        id: "sizes",
        title: "Sizes",
        description: "Four sizes. The icon size is square and needs a label of its own for screen readers.",
        Component: ButtonSizes,
      },
      {
        id: "as-link",
        title: "As a link",
        description:
          "When the click should navigate, render a real link and keep the button's looks. Both spellings work.",
        Component: ButtonAsLink,
      },
    ],
    props: [
      {
        component: "Button",
        name: "variant",
        description: "How much weight the button carries. Anything but default steps back.",
      },
      {
        component: "Button",
        name: "size",
        description: "Height and padding. `icon` is square, for a button that holds nothing but a glyph.",
      },
      {
        component: "Button",
        name: "asChild",
        description:
          "Hands the styling to the single child instead of rendering a <button>. The Radix spelling.",
      },
      {
        component: "Button",
        name: "render",
        description: "The same thing, written the way the current shadcn documentation writes it.",
      },
    ],
    notes: [
      "A disabled button stops receiving mouse events, so it shows no pointer cursor — that is the browser, not a bug.",
      "The `link` variant does not shrink when pressed: text should not move under the reader's finger.",
    ],
  },

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

  select: {
    slug: "select",
    title: "Select",
    summary: "One choice out of a list, in a panel that opens where there is room.",
    description:
      "The trigger reads out the current choice, the arrow keys move through the list, typing jumps to a matching entry, and the panel flips above the trigger when the bottom of the window is too close. It never grows taller than the space it has.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "A trigger, a panel, three entries. The placeholder shows until something is chosen.",
        Component: SelectDefault,
      },
      {
        id: "grouped",
        title: "Groups and separators",
        description: "Headings for long lists, and an entry that cannot be chosen.",
        Component: SelectGrouped,
      },
      {
        id: "controlled",
        title: "Controlled",
        description: "The choice lives in your state, so the rest of the page can react to it.",
        Component: SelectControlled,
      },
    ],
    props: [
      { component: "Select", name: "value", description: "Controlled: the chosen value is yours to hold." },
      { component: "Select", name: "defaultValue", description: "Uncontrolled: what is chosen at the start." },
      { component: "Select", name: "onValueChange", description: "Called with the new value on every choice." },
      { component: "Select", name: "disabled", description: "Turns the whole control off." },
      { component: "Select", name: "name", description: "The name the value is submitted under in a form." },
      { component: "SelectItem", name: "value", description: "What this entry stands for. Required." },
    ],
    notes: [
      "SelectScrollUpButton and SelectScrollDownButton exist so blocks pasted from shadcn compile, but they render nothing: the panel already scrolls on its own and never outgrows the window.",
    ],
  },
};

export const slugs = Object.keys(docs);
