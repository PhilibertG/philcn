import { Button } from "@philcn/components/ui/button.tsx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@philcn/components/ui/sheet.tsx";

const sides = ["right", "left", "top", "bottom"] as const;

export default function SheetSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>It slides in from the {side}.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button>Done</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
