import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@philcn/components/ui/accordion.tsx";

export default function AccordionDefault() {
  return (
    <Accordion type="single" collapsible defaultValue="what" className="w-full max-w-md">
      <AccordionItem value="what">
        <AccordionTrigger>Is philcn a package?</AccordionTrigger>
        <AccordionContent>
          No. The command copies files into your project, and they become yours.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="shadcn">
        <AccordionTrigger>Do shadcn blocks work?</AccordionTrigger>
        <AccordionContent>
          Yes — same names, same props. Change the import line and paste.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="deps">
        <AccordionTrigger>What does it install?</AccordionTrigger>
        <AccordionContent>
          Two optional packages, and only if you use the components that need them.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
