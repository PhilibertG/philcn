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

/**
 * Without the corner cross, the only way out is a button you put there — for
 * a step the reader has to answer rather than dismiss. Escape still works.
 */
export default function DialogWithoutCloseButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Review the change</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Publish version 1.0?</DialogTitle>
          <DialogDescription>A published version cannot be taken back.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Not yet</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Publish</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
