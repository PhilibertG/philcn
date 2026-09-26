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
};
