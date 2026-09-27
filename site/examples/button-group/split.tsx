import { Button } from "@philcn/components/ui/button.tsx";
import { ButtonGroup } from "@philcn/components/ui/button-group.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@philcn/components/ui/dropdown-menu.tsx";

/**
 * The split button: the common action on the left, everything else behind the
 * chevron. This is the shape used at the top of every page here.
 */
export default function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button variant="outline">Copy page</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More ways to copy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Copy as Markdown</DropdownMenuItem>
          <DropdownMenuItem>Copy the link</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
