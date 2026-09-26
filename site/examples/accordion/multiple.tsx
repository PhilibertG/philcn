import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@philcn/components/ui/accordion.tsx";

/** Several panels open at once; the value is an array. */
export default function AccordionMultiple() {
  return (
    <Accordion type="multiple" defaultValue={["first"]} className="w-full max-w-md">
      <AccordionItem value="first">
        <AccordionTrigger>Keyboard</AccordionTrigger>
        <AccordionContent>
          Every header stays in the tab order, on purpose: that is the rule for accordions.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="second">
        <AccordionTrigger>Height</AccordionTrigger>
        <AccordionContent>
          The panel is measured as it opens, so it can slide from nothing to its real height.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
