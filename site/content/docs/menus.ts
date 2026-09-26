import ContextMenuDefault from "@/examples/context-menu/default";
import DropdownMenuCheckboxes from "@/examples/dropdown-menu/checkboxes";
import DropdownMenuDefault from "@/examples/dropdown-menu/default";
import DropdownMenuSubmenu from "@/examples/dropdown-menu/submenu";
import MenubarDefault from "@/examples/menubar/default";
import NavigationMenuDefault from "@/examples/navigation-menu/default";
import type { Doc } from "@/lib/docs";

/**
 * The four menus share a trunk: the same keyboard rules, the same items,
 * the same submenus. What differs is what opens them.
 */
export const menus: Record<string, Doc> = {
  "dropdown-menu": {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    summary: "A list of actions, from a button.",
    description:
      "Actions rather than choices — that is what separates it from a Select. Arrow keys move, typing jumps to a matching entry, Escape closes, and the focus returns to the button that opened it. Items can carry ticks, dots, shortcuts and submenus.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "A label, a group, shortcuts, and one item that means harm.",
        Component: DropdownMenuDefault,
      },
      {
        id: "checkboxes",
        title: "Ticks and dots",
        description:
          "Several boxes, kept open while they are ticked, and a group where only one dot can be on.",
        Component: DropdownMenuCheckboxes,
      },
      {
        id: "submenu",
        title: "Submenus",
        description: "Menus inside menus. Choosing anything closes the whole stack.",
        Component: DropdownMenuSubmenu,
      },
    ],
    props: [
      { component: "DropdownMenu", name: "open", description: "Controlled: whether the menu is showing." },
      { component: "DropdownMenu", name: "onOpenChange", description: "Called when it opens or closes." },
      { component: "DropdownMenuContent", name: "align", description: "How the panel lines up with the button." },
      { component: "DropdownMenuContent", name: "side", description: "Which side of the button it prefers." },
      { component: "DropdownMenuContent", name: "loop", description: "Whether the last item wraps round to the first." },
      {
        component: "DropdownMenuItem",
        name: "variant",
        description: "Destructive paints the item red — for deleting, and nothing else.",
      },
      {
        component: "DropdownMenuItem",
        name: "closeOnSelect",
        description: "Off keeps the menu open after a click, for something that will be clicked again.",
      },
      {
        component: "DropdownMenuItem",
        name: "inset",
        description: "Indents an item that has no tick or icon, so its text lines up with the ones that do.",
      },
      { component: "DropdownMenuCheckboxItem", name: "checked", description: "Whether this item is ticked." },
      { component: "DropdownMenuRadioItem", name: "value", description: "What this dot stands for. Required." },
    ],
  },

  "context-menu": {
    slug: "context-menu",
    title: "Context Menu",
    summary: "The same menu, on a right-click.",
    description:
      "It opens where the pointer is rather than against a button, and it flips when the window edge is too close. Everything else — items, ticks, submenus, the keyboard — is shared with the dropdown menu.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Right-click the area. The menu key on a keyboard does the same.",
        Component: ContextMenuDefault,
      },
    ],
    props: [
      { component: "ContextMenu", name: "open", description: "Controlled: whether the menu is showing." },
      { component: "ContextMenuContent", name: "loop", description: "Whether the last item wraps round to the first." },
      { component: "ContextMenuItem", name: "variant", description: "Destructive paints the item red." },
      {
        component: "ContextMenuTrigger",
        name: "asChild",
        description: "Makes your own element the area that answers the right-click.",
      },
    ],
    notes: [
      "Never put something in here that is nowhere else: a right-click is not available to everyone, and it is invisible to a reader who does not try it.",
    ],
  },

  menubar: {
    slug: "menubar",
    title: "Menubar",
    summary: "File, Edit, Help.",
    description:
      "A row of menus that behaves the way a desktop menu bar does: once one is open, moving the pointer along the bar opens the next, and the arrow keys walk across the bar and down into each menu.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "Three menus. Open one, then move across the bar.",
        Component: MenubarDefault,
      },
    ],
    props: [
      { component: "Menubar", name: "value", description: "Controlled: which menu is open." },
      { component: "Menubar", name: "onValueChange", description: "Called with the menu that just opened." },
      { component: "Menubar", name: "loop", description: "Whether walking past the last menu returns to the first." },
      { component: "MenubarMenu", name: "value", description: "Names this menu, for when you hold the open one yourself." },
      { component: "MenubarItem", name: "variant", description: "Destructive paints the item red." },
    ],
    notes: [
      "This is for an application, not a website. A site's navigation belongs in a Navigation Menu.",
    ],
  },

  "navigation-menu": {
    slug: "navigation-menu",
    title: "Navigation Menu",
    summary: "A site's navigation, with panels under it.",
    description:
      "Links, not actions: what opens is a panel of places to go. The panels share one box, which grows and shrinks to the size of whichever is open, so moving between them is one movement rather than a collapse and an expansion.",
    examples: [
      {
        id: "default",
        title: "Default",
        description: "One panel of components, and one plain link marked as the page you are on.",
        Component: NavigationMenuDefault,
      },
    ],
    props: [
      { component: "NavigationMenu", name: "value", description: "Controlled: which panel is open." },
      {
        component: "NavigationMenu",
        name: "viewport",
        description: "The shared box the panels open into. Off, and each panel sits under its own trigger.",
      },
      { component: "NavigationMenu", name: "delayDuration", description: "How long the pointer must rest before a panel opens." },
      {
        component: "NavigationMenu",
        name: "skipDelayDuration",
        description: "How long the menu stays warm afterwards, so moving to the next trigger opens it at once.",
      },
      {
        component: "NavigationMenuLink",
        name: "active",
        description: "Marks the link to the page being read, for the eye and for a screen reader.",
      },
    ],
    notes: [
      "The shared box's size is measured and published as CSS variables, under our own names and under the `--radix-*` names as well, so a block pasted from shadcn finds what it expects.",
    ],
  },
};
