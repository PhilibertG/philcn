import { Button } from "@philcn/components/ui/button.tsx";
import { Input } from "@philcn/components/ui/input.tsx";
import { Label } from "@philcn/components/ui/label.tsx";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@philcn/components/ui/popover.tsx";

export default function PopoverDefault() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set a width</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Applies to the selected block.</PopoverDescription>
        </PopoverHeader>
        <div className="mt-3 grid gap-2">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="320px" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
