"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@philcn/components/ui/tabs.tsx";

/**
 * The two faces of an example: the thing running, and the file it came from.
 *
 * Both are rendered on the server and handed here as children — the preview
 * so it works, the code so it stays coloured without shipping a highlighter
 * to the browser. This component only remembers which of the two you asked
 * for, which is why it is the one piece that runs in the browser.
 */
export function ExampleTabs({ preview, code }: { preview: React.ReactNode; code: React.ReactNode }) {
  return (
    <Tabs defaultValue="preview" className="gap-3">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-brand-line bg-background p-8">
          {preview}
        </div>
      </TabsContent>
      <TabsContent value="code">{code}</TabsContent>
    </Tabs>
  );
}
