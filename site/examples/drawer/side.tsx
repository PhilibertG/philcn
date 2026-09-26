import { Button } from "@philcn/components/ui/button.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@philcn/components/ui/drawer.tsx";

/** `swipeDirection` decides which edge it comes from, and which way it is dragged. */
export default function DrawerSide() {
  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger asChild>
        <Button variant="outline">From the right</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Drag it back to the right to close.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
