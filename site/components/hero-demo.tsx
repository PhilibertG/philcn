"use client";

import * as React from "react";

import { Badge } from "@philcn/components/ui/badge.tsx";
import { Button } from "@philcn/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@philcn/components/ui/card.tsx";
import { Input } from "@philcn/components/ui/input.tsx";
import { Label } from "@philcn/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@philcn/components/ui/select.tsx";
import { Switch } from "@philcn/components/ui/switch.tsx";

/**
 * Real philcn components, wired together the way a shadcn block would be.
 * Nothing here is a picture: the select opens, the switch flips, the button
 * takes the focus ring.
 */
export function HeroDemo() {
  const [name, setName] = React.useState("aurora");
  const [framework, setFramework] = React.useState("next");
  const [isPublic, setIsPublic] = React.useState(true);

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create a project</CardTitle>
        <CardDescription>Give it a name and pick a framework.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="hero-demo-name">Name</Label>
          <Input
            id="hero-demo-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="my-project"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hero-demo-framework">Framework</Label>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger id="hero-demo-framework" className="w-full">
              <SelectValue placeholder="Pick one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
              <SelectItem value="remix">React Router</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="grid gap-0.5">
            <Label htmlFor="hero-demo-public">Public repository</Label>
            <span className="text-xs text-muted-foreground">Anyone can read the code.</span>
          </div>
          <Switch id="hero-demo-public" checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3">
        <Button className="w-full">Create project</Button>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary">{framework}</Badge>
          <Badge variant={isPublic ? "default" : "outline"}>
            {isPublic ? "public" : "private"}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
