import { Avatar, AvatarFallback, AvatarImage } from "@philcn/components/ui/avatar.tsx";

const people = [
  { initials: "AB", src: "https://avatars.githubusercontent.com/u/1?v=4" },
  { initials: "CD", src: "https://avatars.githubusercontent.com/u/2?v=4" },
  { initials: "EF", src: "" },
];

/** Overlapped, with a ring in the page's colour so they read as a stack. */
export default function AvatarStack() {
  return (
    <div className="flex -space-x-2">
      {people.map((person) => (
        <Avatar key={person.initials} className="ring-2 ring-background">
          <AvatarImage src={person.src} alt="" />
          <AvatarFallback>{person.initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
