import {
  Button as RACButton,
  Group as RACGroup,
  type GroupProps as RACGroupProps,
  Input as RACInput,
  type InputProps as RACInputProps,
  NumberField as RACNumberField,
  type NumberFieldProps as RACNumberFieldProps,
  Text as RACText,
  composeRenderProps,
} from "react-aria-components";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";
import { FieldError, Label } from "./textfield.tsx";

export interface NumberFieldProps extends RACNumberFieldProps {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  error?: ReactNode;
  placeholder?: string | undefined;
}

export function NumberField({
  label,
  description,
  errorMessage,
  error,
  placeholder,
  className,
  children,
  ...props
}: NumberFieldProps) {
  return (
    <RACNumberField
      {...props}
      className={composeRenderProps(className, (cls) => cn("group flex flex-col gap-1.5", cls))}
    >
      {(renderProps) => (
        <>
          {label && (
            <Label>
              {label}
              {props.isRequired && <span className="ml-1 text-destructive">*</span>}
            </Label>
          )}
          {children ? (
            typeof children === "function" ? (
              children(renderProps)
            ) : (
              children
            )
          ) : (
            <NumberFieldGroup>
              <NumberFieldInput {...(placeholder !== undefined ? { placeholder } : {})} />
              <NumberFieldSteppers />
            </NumberFieldGroup>
          )}
          {description && (
            <RACText slot="description" className="text-xs text-muted-foreground">
              {description}
            </RACText>
          )}
          {(errorMessage || error) && <FieldError>{errorMessage || error}</FieldError>}
        </>
      )}
    </RACNumberField>
  );
}

export interface NumberFieldGroupProps extends RACGroupProps {}

export function NumberFieldGroup({ className, ...props }: NumberFieldGroupProps) {
  return (
    <RACGroup
      {...props}
      className={composeRenderProps(className, (cls) =>
        cn(
          "relative flex h-9 w-full items-center rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow]",
          "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring",
          "invalid:border-destructive invalid:ring-destructive",
          cls,
        ),
      )}
    />
  );
}

export interface NumberFieldInputProps extends RACInputProps {}

export function NumberFieldInput({ className, ...props }: NumberFieldInputProps) {
  return (
    <RACInput
      {...props}
      className={composeRenderProps(
        className,
        (cls: string = "") =>
          cn(
            "h-full w-full bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            cls,
          ) || "",
      )}
    />
  );
}

export function NumberFieldSteppers() {
  return (
    <div className="flex flex-col h-full border-l border-input">
      <RACButton
        slot="increment"
        className="flex flex-1 w-6 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground pressed:bg-muted/80 disabled:opacity-30 cursor-pointer"
      >
        <ChevronUp className="size-3" />
      </RACButton>
      <RACButton
        slot="decrement"
        className="flex flex-1 w-6 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground pressed:bg-muted/80 disabled:opacity-30 border-t border-input cursor-pointer"
      >
        <ChevronDown className="size-3" />
      </RACButton>
    </div>
  );
}
