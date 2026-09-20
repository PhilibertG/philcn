"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "../../lib/cn.ts";
import { Slot } from "../../lib/slot.tsx";
import { useId } from "../../lib/use-id.ts";
import { Label } from "./label.tsx";

/**
 * The only component in philcn that leans on an outside package.
 *
 * `react-hook-form` holds what a form is doing — the values, what has been
 * touched, what failed validation. It draws nothing at all. This file is the
 * part that draws: a field lays out its label, its control, its hint and its
 * error, wires the three together for screen readers, and turns red in the
 * right places when the value is wrong.
 */

const Form = FormProvider;

interface FieldContextValue {
  name: string;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

interface ItemContextValue {
  id: string;
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  const value = React.useMemo<FieldContextValue>(() => ({ name: props.name }), [props.name]);
  return (
    <FieldContext.Provider value={value}>
      <Controller {...props} />
    </FieldContext.Provider>
  );
}

/**
 * Everything a part of a field needs to know: the ids that tie the label, the
 * hint and the error to the control, and whether that control is in error.
 */
function useFormField() {
  const field = React.useContext(FieldContext);
  const item = React.useContext(ItemContext);
  if (field === null) throw new Error("useFormField must be used inside <FormField>");
  if (item === null) throw new Error("useFormField must be used inside <FormItem>");

  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: field.name });
  const state = getFieldState(field.name, formState);

  return {
    id: item.id,
    name: field.name,
    formItemId: `${item.id}-form-item`,
    formDescriptionId: `${item.id}-form-item-description`,
    formMessageId: `${item.id}-form-item-message`,
    ...state,
  };
}

function FormItem({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const id = useId();
  const value = React.useMemo<ItemContextValue>(() => ({ id }), [id]);

  return (
    <ItemContext.Provider value={value}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </ItemContext.Provider>
  );
}

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(function FormLabel({ className, ...props }, ref) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      data-slot="form-label"
      data-error={error !== undefined}
      className={cn("data-[error=true]:text-destructive", className)}
      {...props}
    />
  );
});

export interface FormControlProps {
  children?: React.ReactNode;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

/**
 * Hands the field's wiring to whichever control sits inside it — an input, a
 * select, a switch — without wrapping it in anything.
 */
const FormControl = React.forwardRef<HTMLElement, FormControlProps>(
  function FormControl({ children, render }, ref) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        render={render}
        data-slot="form-control"
        id={formItemId}
        // The hint is always announced; the error only once there is one.
        aria-describedby={
          error === undefined ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={error !== undefined}
      >
        {children}
      </Slot>
    );
  },
);

function FormDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      data-slot="form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FormMessage({ className, children, ...props }: React.ComponentPropsWithoutRef<"p">) {
  const { error, formMessageId } = useFormField();
  // The validation message wins over anything written by hand, and an empty
  // message renders nothing rather than an empty red line.
  const body = error === undefined ? children : String(error.message ?? "");
  if (body === undefined || body === null || body === "") return null;

  return (
    <p
      id={formMessageId}
      data-slot="form-message"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
