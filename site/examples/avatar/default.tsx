import { Avatar, AvatarFallback, AvatarImage } from "@philcn/components/ui/avatar.tsx";

export default function AvatarDefault() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" alt="" />
        <AvatarFallback>PG</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://example.invalid/missing.png" alt="" />
        <AvatarFallback>PG</AvatarFallback>
      </Avatar>
    </div>
  );
}
