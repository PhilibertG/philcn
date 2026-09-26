import SelectControlled from "@/examples/select/controlled";
import SelectDefault from "@/examples/select/default";
import SelectGrouped from "@/examples/select/grouped";
import type { Doc } from "@/lib/docs";

/** Everything someone fills in. */
export const forms: Record<string, Doc> = {
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
