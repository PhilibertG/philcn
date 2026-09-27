import { Button } from "@philcn/components/ui/button.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@philcn/components/ui/drawer.tsx";

/**
 * Drag the handle down and the panel follows your finger; let go past a
 * quarter of its height, or flick it, and it closes.
 */
export default function DrawerDefault() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share this release</DrawerTitle>
          <DrawerDescription>Anyone with the link can read the notes.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Copy link</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
