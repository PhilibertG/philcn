import { Button } from "@philcn/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@philcn/components/ui/dropdown-menu.tsx";

/** Menus inside menus, as deep as you like. Choosing anything closes the lot. */
export default function DropdownMenuSubmenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Share</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem>Copy link</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite someone</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>By email</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>By message</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Slack</DropdownMenuItem>
                <DropdownMenuItem>Signal</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Stop sharing</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
