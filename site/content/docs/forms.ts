import CalendarDefault from "@/examples/calendar/default";
import CalendarRange from "@/examples/calendar/range";
import CheckboxDefault from "@/examples/checkbox/default";
import CheckboxIndeterminate from "@/examples/checkbox/indeterminate";
import FormDefault from "@/examples/form/default";
import InputDefault from "@/examples/input/default";
import InputStates from "@/examples/input/states";
import LabelDefault from "@/examples/label/default";
import RadioGroupDefault from "@/examples/radio-group/default";
import SelectControlled from "@/examples/select/controlled";
import SelectDefault from "@/examples/select/default";
import SelectGrouped from "@/examples/select/grouped";
import SliderDefault from "@/examples/slider/default";
import SliderRange from "@/examples/slider/range";
import SwitchDefault from "@/examples/switch/default";
import TextareaDefault from "@/examples/textarea/default";
import ToggleDefault from "@/examples/toggle/default";
import ToggleGroupMultiple from "@/examples/toggle-group/multiple";
import ToggleGroupSingle from "@/examples/toggle-group/single";
import type { Doc } from "@/lib/docs";

/** Everything someone fills in. */
export const forms: Record<string, Doc> = {
  input: {
    slug: "input",
    title: "Input",
    summary: "One line of anything.",
    description:
      "A plain <input> wearing the theme. Every attribute an input has works here — type, placeholder, required, autoComplete — because they go straight through. A field marked invalid turns red on its own: that comes from aria-invalid, not from a class you add.",
    element: "input",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "With a label tied to it, which is what makes the label clickable.",
        Component: InputDefault,
      },
      {
        id: "states",
        title: "States",
        description: "Ordinary, disabled, invalid, and the file picker.",
        Component: InputStates,
      },
    ],
    props: [
      { component: "Input", name: "type", description: "Any input type. The file type is styled too." },
      { component: "Input", name: "disabled", description: "Greys it out and takes it out of the tab order." },
    ],
    notes: [
      "Mark a wrong field with `aria-invalid`: it colours the field and tells a screen reader, where a red class would only do the first.",
    ],
  },

  textarea: {
    slug: "textarea",
    title: "Textarea",
    summary: "Several lines of anything.",
    description:
      "The input's taller sibling, for a message rather than a name. It keeps the browser's resize handle, so the reader can make room when they need it.",
    element: "textarea",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Four rows to start with, and free to grow from there.",
        Component: TextareaDefault,
      },
    ],
    props: [
      { component: "Textarea", name: "rows", description: "How tall it starts." },
      { component: "Textarea", name: "disabled", description: "Greys it out and takes it out of the tab order." },
    ],
  },

  label: {
    slug: "label",
    title: "Label",
    summary: "The words in front of a field.",
    description:
      "Tie it to its field and two things follow: clicking the words focuses or ticks the field, and a screen reader reads the label when the field takes focus. A field without one is a field nobody can name.",
    element: "label",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Click the words rather than the box — the box ticks.",
        Component: LabelDefault,
      },
    ],
    props: [
      {
        component: "Label",
        name: "htmlFor",
        description: "The id of the field it names. This is the tie; without it the label is decoration.",
      },
    ],
  },

  checkbox: {
    slug: "checkbox",
    title: "Checkbox",
    summary: "Yes, no, or some of them.",
    description:
      "A box that is ticked, empty, or half-ticked. The third state is for a parent box standing over a list where only some are chosen: it is announced as mixed, and clicking it chooses all of them.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Ticked to start with, empty, and one that cannot be changed.",
        Component: CheckboxDefault,
      },
      {
        id: "indeterminate",
        title: "Half-ticked",
        description: "The parent box follows its children: all, none, or some.",
        Component: CheckboxIndeterminate,
      },
    ],
    props: [
      {
        component: "Checkbox",
        name: "checked",
        description: 'Controlled. `true`, `false`, or the string `"indeterminate"` for the mixed state.',
      },
      { component: "Checkbox", name: "defaultChecked", description: "Uncontrolled: how it starts." },
      { component: "Checkbox", name: "onCheckedChange", description: "Called with the new state on every click." },
      { component: "Checkbox", name: "name", description: "The name it is submitted under in a form." },
      { component: "Checkbox", name: "disabled", description: "Out of reach, and out of the tab order." },
    ],
  },

  switch: {
    slug: "switch",
    title: "Switch",
    summary: "On or off, and it happens now.",
    description:
      "Use a switch when the change takes effect the moment it is flipped, and a checkbox when it only counts once the form is submitted. That is the whole difference, and readers feel it.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "One on, one off. Space flips the focused switch.",
        Component: SwitchDefault,
      },
    ],
    props: [
      { component: "Switch", name: "checked", description: "Controlled: on or off." },
      { component: "Switch", name: "defaultChecked", description: "Uncontrolled: how it starts." },
      { component: "Switch", name: "onCheckedChange", description: "Called with the new state on every flip." },
      { component: "Switch", name: "disabled", description: "Out of reach, and out of the tab order." },
    ],
  },

  "radio-group": {
    slug: "radio-group",
    title: "Radio Group",
    summary: "Exactly one of several.",
    description:
      "Tab enters the group once and the arrow keys move inside it — which is what the keyboard expects of radios, and the reason they are not a row of separate buttons. Every item needs a label of its own.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Three choices. Tab in, then use the arrows.",
        Component: RadioGroupDefault,
      },
    ],
    props: [
      { component: "RadioGroup", name: "value", description: "Controlled: the chosen value." },
      { component: "RadioGroup", name: "defaultValue", description: "Uncontrolled: what is chosen at the start." },
      { component: "RadioGroup", name: "onValueChange", description: "Called with the new value on every choice." },
      {
        component: "RadioGroup",
        name: "orientation",
        description: "Which arrow keys move through the group. Horizontal for a row, vertical for a column.",
      },
      { component: "RadioGroup", name: "loop", description: "Whether the last item wraps round to the first." },
      { component: "RadioGroupItem", name: "value", description: "What this choice stands for. Required." },
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

  slider: {
    slug: "slider",
    title: "Slider",
    summary: "A number you drag.",
    description:
      "One handle for a value, two for a range. The arrow keys move by one step, Home and End jump to the ends, and the whole track is clickable — the handle goes where you click.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "One handle between 0 and 100.",
        Component: SliderDefault,
      },
      {
        id: "range",
        title: "A range",
        description: "Two handles that cannot cross, and a value you hold yourself.",
        Component: SliderRange,
      },
    ],
    props: [
      { component: "Slider", name: "value", description: "Controlled. Always an array, even with one handle." },
      { component: "Slider", name: "defaultValue", description: "Uncontrolled: where the handles start." },
      { component: "Slider", name: "onValueChange", description: "Called on every movement, while dragging." },
      {
        component: "Slider",
        name: "onValueCommit",
        description: "Called once, when the handle is let go. Use this one to save or to fetch.",
      },
      { component: "Slider", name: "min", description: "The low end. 0 by default." },
      { component: "Slider", name: "max", description: "The high end. 100 by default." },
      { component: "Slider", name: "step", description: "How far one arrow key press moves." },
      {
        component: "Slider",
        name: "minStepsBetweenThumbs",
        description: "How many steps two handles must keep between them, so they cannot cross or overlap.",
      },
      { component: "Slider", name: "orientation", description: "Horizontal or vertical." },
    ],
  },

  toggle: {
    slug: "toggle",
    title: "Toggle",
    summary: "A button that stays pressed.",
    description:
      "Bold, italic, mute: a button whose state is part of what it means. It is announced as pressed or not, which a plain button never is.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Three toggles, one of them pressed to start with.",
        Component: ToggleDefault,
      },
    ],
    props: [
      { component: "Toggle", name: "pressed", description: "Controlled: pressed or not." },
      { component: "Toggle", name: "defaultPressed", description: "Uncontrolled: how it starts." },
      { component: "Toggle", name: "onPressedChange", description: "Called with the new state on every press." },
      { component: "Toggle", name: "variant", description: "Plain, or outlined." },
      { component: "Toggle", name: "size", description: "Three heights, like the Button's." },
    ],
    notes: [
      "A toggle holding only a glyph needs `aria-label`: the letter B tells a screen reader nothing.",
    ],
  },

  "toggle-group": {
    slug: "toggle-group",
    title: "Toggle Group",
    summary: "Toggles that belong together.",
    description:
      "Single, and it behaves like radios that look like buttons. Multiple, and each one is independent. Either way Tab enters the group once and the arrow keys move inside it.",
    examples: [
      {
        id: "single",
        title: "One at a time",
        description: "Alignment: choosing one lets the last one go.",
        Component: ToggleGroupSingle,
      },
      {
        id: "multiple",
        title: "Several at once",
        description: "Bold and italic together; the value is an array.",
        Component: ToggleGroupMultiple,
      },
    ],
    props: [
      {
        component: "ToggleGroup",
        name: "type",
        description: 'Required. `"single"` for one choice, `"multiple"` for any number.',
      },
      { component: "ToggleGroup", name: "value", description: "Controlled. A string, or an array when multiple." },
      { component: "ToggleGroup", name: "defaultValue", description: "Uncontrolled: what is pressed at the start." },
      { component: "ToggleGroup", name: "onValueChange", description: "Called with the new value on every change." },
      { component: "ToggleGroup", name: "variant", description: "Passed down to every item." },
      { component: "ToggleGroup", name: "size", description: "Passed down to every item." },
      { component: "ToggleGroupItem", name: "value", description: "What this item stands for. Required." },
    ],
  },

  calendar: {
    slug: "calendar",
    title: "Calendar",
    summary: "Days, months and years, written by hand.",
    description:
      "One day, several days, or a stretch of them. It can show more than one month at a time, offer dropdowns for month and year, and speak whatever language you hand it. There is no date library behind it — the arithmetic is ours.",
    examples: [
      {
        id: "default",
        title: "One day",
        description: "Arrow keys move a day at a time; Page Up and Page Down move a month.",
        Component: CalendarDefault,
      },
      {
        id: "range",
        title: "A range, over two months",
        description: "Pick a first day, then a last one. Two months make a long stretch easier to see.",
        Component: CalendarRange,
      },
    ],
    props: [
      {
        component: "Calendar",
        name: "mode",
        description: 'One of `"single"`, `"multiple"` or `"range"`. It decides what `selected` holds.',
      },
      { component: "Calendar", name: "selected", description: "What is chosen: a date, an array of them, or a range." },
      { component: "Calendar", name: "onSelect", description: "Called with the new choice, in the shape of the mode." },
      { component: "Calendar", name: "defaultMonth", description: "The month to open on, when nothing is chosen yet." },
      { component: "Calendar", name: "numberOfMonths", description: "How many months to show side by side." },
      {
        component: "Calendar",
        name: "captionLayout",
        description: "A plain caption, or dropdowns for the month, the year, or both.",
      },
      { component: "Calendar", name: "disabled", description: "Which days cannot be chosen." },
      { component: "Calendar", name: "showOutsideDays", description: "Whether the days either side of the month are drawn." },
      { component: "Calendar", name: "weekStartsOn", description: "0 for Sunday, 1 for Monday, and so on." },
    ],
    notes: [
      "A date picker is not a component here, any more than it is at shadcn: it is a Calendar inside a Popover.",
    ],
  },

  form: {
    slug: "form",
    title: "Form",
    summary: "Labels, hints and errors, tied to their fields.",
    description:
      "This is the only component that leans on an outside package: react-hook-form holds the values, the touched fields and the validation. What these components do is the wiring nobody enjoys — giving the field an id, pointing the label at it, tying the hint and the error to it, and marking it invalid when it is.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Submit it empty: two errors appear, and correcting a field clears its own.",
        Component: FormDefault,
      },
    ],
    props: [
      { component: "FormField", name: "name", description: "The field's name in the form. Required." },
      { component: "FormField", name: "control", description: "The control object from useForm." },
      { component: "FormField", name: "rules", description: "The validation rules for this field." },
      {
        component: "FormField",
        name: "render",
        description: "Draws the field. It is handed the field's props to spread onto your input.",
      },
    ],
    notes: [
      "Install react-hook-form yourself: philcn lists it as optional, so a project with no form never installs it.",
      "FormMessage shows the error for its own field and disappears when there is none — you do not pass it anything.",
    ],
  },
};
