import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@philcn/components/ui/command.tsx";

/**
 * Type to filter. The focus never leaves the field — the arrow keys move a
 * marker, and the field tells a screen reader which entry is marked.
 */
export default function CommandDefault() {
  return (
    <Command className="w-full max-w-sm rounded-xl border border-border">
      <CommandInput placeholder="Search components…" />
      <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>
        <CommandGroup heading="Components">
          <CommandItem>
            Button <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>Dialog</CommandItem>
          <CommandItem keywords={["dropdown", "listbox"]}>Select</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Pages">
          <CommandItem>Installation</CommandItem>
          <CommandItem disabled>Themes (soon)</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
