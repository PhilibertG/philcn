import { Button } from "@philcn/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@philcn/components/ui/dialog.tsx";
import { Input } from "@philcn/components/ui/input.tsx";
import { Label } from "@philcn/components/ui/label.tsx";

/**
 * The first field takes focus when the dialog opens, and Tab never leaves the
 * dialog while it is open.
 */
export default function DialogWithForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Rename</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>This is the name your team will see.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="project-name">Name</Label>
          <Input id="project-name" defaultValue="philcn" autoFocus />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
