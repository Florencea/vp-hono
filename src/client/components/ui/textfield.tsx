import {
  FieldError as RACFieldError,
  type FieldErrorProps as RACFieldErrorProps,
  Input as RACInput,
  type InputProps as RACInputProps,
  Label as RACLabel,
  type LabelProps as RACLabelProps,
  TextArea as RACTextArea,
  type TextAreaProps as RACTextAreaProps,
  TextField as RACTextField,
  type TextFieldProps as RACTextFieldProps,
  Text as RACText,
  composeRenderProps,
} from "react-aria-components";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export const inputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring focused:ring-2 focused:ring-ring focused:border-ring disabled:cursor-not-allowed disabled:opacity-50 invalid:border-destructive invalid:ring-destructive aria-invalid:border-destructive aria-invalid:ring-destructive",
);

export const textAreaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring focused:ring-2 focused:ring-ring focused:border-ring disabled:cursor-not-allowed disabled:opacity-50 invalid:border-destructive invalid:ring-destructive aria-invalid:border-destructive aria-invalid:ring-destructive resize-y",
);

export interface InputProps extends RACInputProps {}

export function Input({ className, ...props }: InputProps) {
  return (
    <RACInput
      {...props}
      className={composeRenderProps(
        className,
        (cls: string = "") => cn(inputVariants(), cls) || "",
      )}
    />
  );
}

export interface TextAreaProps extends RACTextAreaProps {}

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <RACTextArea
      {...props}
      className={composeRenderProps(
        className,
        (cls: string = "") => cn(textAreaVariants(), cls) || "",
      )}
    />
  );
}

export interface LabelProps extends RACLabelProps {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={cn(
        "text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}

export interface FieldErrorProps extends RACFieldErrorProps {}

export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeRenderProps(className, (cls) =>
        cn("text-xs font-medium text-destructive", cls),
      )}
    />
  );
}

export interface TextFieldProps extends RACTextFieldProps {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  error?: ReactNode;
  placeholder?: string | undefined;
}

export function TextField({
  label,
  description,
  errorMessage,
  error,
  placeholder,
  className,
  children,
  ...props
}: TextFieldProps) {
  return (
    <RACTextField
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
            <Input {...(placeholder !== undefined ? { placeholder } : {})} />
          )}
          {description && (
            <RACText slot="description" className="text-xs text-muted-foreground">
              {description}
            </RACText>
          )}
          {(errorMessage || error) && <FieldError>{errorMessage || error}</FieldError>}
        </>
      )}
    </RACTextField>
  );
}
