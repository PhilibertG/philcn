import { Avatar, AvatarFallback, AvatarImage } from "@philcn/components/ui/avatar.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@philcn/components/ui/hover-card.tsx";

/**
 * A tooltip carries a few words; a hover card carries content you can reach
 * with the pointer — links included, because moving to the card keeps it open.
 */
export default function HoverCardDefault() {
  return (
    <HoverCard>
      <HoverCardTrigger href="https://github.com/PhilibertG" className="font-medium underline-offset-4 hover:underline">
        @PhilibertG
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" alt="" />
            <AvatarFallback>PG</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Philibert Gentien</p>
            <p className="text-muted-foreground">Writes philcn, one component at a time.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
