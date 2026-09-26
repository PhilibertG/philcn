import AspectRatioDefault from "@/examples/aspect-ratio/default";
import AvatarDefault from "@/examples/avatar/default";
import AvatarStack from "@/examples/avatar/stack";
import BadgeAsLink from "@/examples/badge/as-link";
import BadgeVariants from "@/examples/badge/variants";
import ButtonAsLink from "@/examples/button/as-link";
import ButtonSizes from "@/examples/button/sizes";
import ButtonVariants from "@/examples/button/variants";
import EmptyDefault from "@/examples/empty/default";
import KbdDefault from "@/examples/kbd/default";
import ProgressDefault from "@/examples/progress/default";
import ProgressIndeterminate from "@/examples/progress/indeterminate";
import SeparatorDefault from "@/examples/separator/default";
import SkeletonDefault from "@/examples/skeleton/default";
import SpinnerDefault from "@/examples/spinner/default";
import type { Doc } from "@/lib/docs";

/** The pieces you barely notice until they are missing. */
export const basics: Record<string, Doc> = {
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

  badge: {
    slug: "badge",
    title: "Badge",
    summary: "A small label that states a fact.",
    description:
      "A count, a status, a version. A badge is not a button: it says what something is, it does not invite a click. When it does need to navigate, hand it a link.",
    element: "span",
    examples: [
      {
        id: "variants",
        title: "Variants",
        description: "Four weights, the same four names the Button uses.",
        Component: BadgeVariants,
      },
      {
        id: "as-link",
        title: "As a link",
        description: "The badge's looks on a real anchor, so it behaves like the link it is.",
        Component: BadgeAsLink,
      },
    ],
    props: [
      { component: "Badge", name: "variant", description: "Which of the four looks to wear." },
      {
        component: "Badge",
        name: "asChild",
        description: "Styles the single child instead of rendering a <span>.",
      },
      { component: "Badge", name: "render", description: "The same thing, the shadcn spelling." },
    ],
  },

  avatar: {
    slug: "avatar",
    title: "Avatar",
    summary: "A face, or the initials standing in for it.",
    description:
      "The image is shown once it has loaded; until then, and for good if it never arrives, the fallback holds its place. The swap is a 200 ms fade rather than a jump, and the shape never changes size, so a row of avatars does not shuffle as pictures arrive.",
    examples: [
      {
        id: "default",
        title: "Default",
        description:
          "Two avatars: the first finds its picture, the second does not and keeps its initials.",
        Component: AvatarDefault,
      },
      {
        id: "stack",
        title: "A stack",
        description: "Overlapped, with a ring in the page's colour so they read as a group.",
        Component: AvatarStack,
      },
    ],
    props: [
      { component: "AvatarImage", name: "src", description: "The picture to show once it loads." },
      {
        component: "AvatarImage",
        name: "alt",
        description:
          "Leave it empty when the name is written next to the avatar: repeating it only makes a screen reader say it twice.",
      },
      {
        component: "AvatarFallback",
        name: "delayMs",
        description:
          "Waits this long before showing the initials, so a picture that arrives quickly does not flash them first.",
      },
    ],
  },

  kbd: {
    slug: "kbd",
    title: "Kbd",
    summary: "A key, drawn as a key.",
    description:
      "For naming a shortcut inside a sentence. Group the keys of one shortcut together: the group is what tells a screen reader that ⌘ and K are one thing rather than two.",
    element: "kbd",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Single keys and a grouped shortcut.",
        Component: KbdDefault,
      },
    ],
    props: [],
    notes: ["Write the key the way the reader's keyboard writes it: ⌘ on a Mac, Ctrl elsewhere."],
  },

  separator: {
    slug: "separator",
    title: "Separator",
    summary: "A line between two things.",
    description:
      "Horizontal by default, vertical when the things sit side by side. A separator that is only there for the eye should say so, and then screen readers skip it.",
    element: "div",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "One line under a heading, and three between links in a row.",
        Component: SeparatorDefault,
      },
    ],
    props: [
      { component: "Separator", name: "orientation", description: "Horizontal or vertical." },
      {
        component: "Separator",
        name: "decorative",
        description:
          "True when the line is only for the eye: it is then hidden from screen readers. False when it really separates two sections, and it is announced as a divider.",
      },
    ],
    notes: [
      "A vertical separator takes its height from the row around it, so give that row a height — `h-5` in the example.",
    ],
  },

  skeleton: {
    slug: "skeleton",
    title: "Skeleton",
    summary: "The shape of what is loading.",
    description:
      "A pulsing block in the size of the thing that is coming. Because it takes the room the content will take, nothing jumps when the content lands — which is the whole point of it.",
    element: "div",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "An avatar and two lines of text, in the size they will be.",
        Component: SkeletonDefault,
      },
    ],
    props: [],
    notes: [
      "Size it with the same classes as the real thing. A skeleton in the wrong size is worse than none: the page moves anyway.",
    ],
  },

  spinner: {
    slug: "spinner",
    title: "Spinner",
    summary: "Something is happening.",
    description:
      "For a wait too short to be worth a skeleton, or one whose size is unknown. It takes its colour from the text around it and its size from a class, so it fits inside a button without being told anything.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "On its own, larger, and inside a button that is busy.",
        Component: SpinnerDefault,
      },
    ],
    props: [],
    notes: [
      "A button holding a spinner should be disabled while it spins, or the reader can send the same thing twice.",
    ],
  },

  progress: {
    slug: "progress",
    title: "Progress",
    summary: "How far along something is.",
    description:
      "A bar between 0 and a maximum, announced to screen readers as it moves. Without a value it becomes indeterminate: it says that something is happening without claiming to know how much is left.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Drag the slider: the bar and its announcement follow.",
        Component: ProgressDefault,
      },
      {
        id: "indeterminate",
        title: "Indeterminate",
        description: "No value, no promise about how long it will take.",
        Component: ProgressIndeterminate,
      },
    ],
    props: [
      { component: "Progress", name: "value", description: "Where it is. `null` means unknown." },
      { component: "Progress", name: "max", description: "What counts as finished. 100 by default." },
    ],
  },

  "aspect-ratio": {
    slug: "aspect-ratio",
    title: "Aspect Ratio",
    summary: "A box that keeps its shape.",
    description:
      "Holds its contents to a ratio whatever the width. Use it around anything whose height would otherwise be decided after loading — a picture, a video, an embedded map — so the page does not jump when it arrives.",
    element: "div",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Sixteen by nine, at whatever width the column gives it.",
        Component: AspectRatioDefault,
      },
    ],
    props: [
      {
        component: "AspectRatio",
        name: "ratio",
        description: "Width divided by height. Write it as a division — `16 / 9` — and read it later.",
      },
    ],
  },

  empty: {
    slug: "empty",
    title: "Empty",
    summary: "The page where there is nothing yet.",
    description:
      "A title, a sentence and a way forward. The first time someone opens a list it is empty, and that screen is the one they judge the product on — so it says what belongs here and hands them the button that puts it there.",
    element: "div",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "An icon, what is missing, and the one action that fixes it.",
        Component: EmptyDefault,
      },
    ],
    props: [
      {
        component: "EmptyMedia",
        name: "variant",
        description:
          "`icon` draws the tinted square around a glyph; the default leaves whatever you put in it alone, for a picture or an illustration.",
      },
    ],
    notes: [
      "Write the description as an instruction, not an apology. \"Add your first component\" beats \"No data available\".",
    ],
  },
};
