"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@philcn/components/ui/tabs.tsx";

/**
 * One command, in the four package managers people actually use.
 *
 * Each one is coloured on the server and handed here as a child; this side
 * only remembers which one you asked for. The choice is kept for the whole
 * site, so someone reading with pnpm is not shown npm again on the next page.
 */
export function CommandTabs({ managers }: { managers: { name: string; code: React.ReactNode }[] }) {
  const [current, setCurrent] = React.useState(managers[0]?.name ?? "npm");

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("philcn-package-manager");
      if (saved && managers.some((manager) => manager.name === saved)) setCurrent(saved);
    } catch {
      // No storage, no memory. The tabs still work.
    }
  }, [managers]);

  function choose(name: string) {
    setCurrent(name);
    try {
      localStorage.setItem("philcn-package-manager", name);
    } catch {
      // As above.
    }
  }

  return (
    <Tabs value={current} onValueChange={choose} className="gap-3">
      <TabsList>
        {managers.map((manager) => (
          <TabsTrigger key={manager.name} value={manager.name}>
            {manager.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {managers.map((manager) => (
        <TabsContent key={manager.name} value={manager.name}>
          {manager.code}
        </TabsContent>
      ))}
    </Tabs>
  );
}
