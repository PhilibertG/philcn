import { Alert, AlertDescription, AlertTitle } from "@philcn/components/ui/alert.tsx";

export default function AlertDefault() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <Alert>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" />
        </svg>
        <AlertTitle>Version 0.4.2 is out</AlertTitle>
        <AlertDescription>Run the command again to pick up the newest files.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <AlertTitle>The stylesheet is missing an import</AlertTitle>
        <AlertDescription>Without philcn/source.css, menus and dialogs come out unstyled.</AlertDescription>
      </Alert>
    </div>
  );
}
