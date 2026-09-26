"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@philcn/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@philcn/components/ui/form.tsx";
import { Input } from "@philcn/components/ui/input.tsx";

type Values = { project: string; email: string };

/**
 * react-hook-form holds the values and the errors; these components only
 * draw them. They also tie the label, the hint and the error message to the
 * field, and mark the field invalid — the part that is easy to forget.
 */
export default function FormDefault() {
  const form = useForm<Values>({ defaultValues: { project: "", email: "" } });
  const [sent, setSent] = React.useState<Values | null>(null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => setSent(values))}
        className="grid w-full max-w-sm gap-5"
      >
        <FormField
          control={form.control}
          name="project"
          rules={{ required: "A project needs a name." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <FormControl>
                <Input placeholder="philcn" {...field} />
              </FormControl>
              <FormDescription>This is what your team will see.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "We need an address to write to.",
            pattern: { value: /.+@.+\..+/, message: "That does not look like an address." },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
        {sent ? (
          <p className="text-sm text-brand-ink-soft">
            Sent: {sent.project}, {sent.email}
          </p>
        ) : null}
      </form>
    </Form>
  );
}
