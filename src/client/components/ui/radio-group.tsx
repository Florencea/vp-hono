import {
  Radio as RACRadio,
  type RadioProps as RACRadioProps,
  RadioGroup as RACRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
  Text as RACText,
  composeRenderProps,
} from "react-aria-components";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";
import { FieldError, Label } from "./textfield.tsx";

export interface RadioGroupProps extends RACRadioGroupProps {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  error?: ReactNode;
}

export function RadioGroup({
  label,
  description,
  errorMessage,
  error,
  orientation = "vertical",
  className,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <RACRadioGroup
      orientation={orientation}
      {...props}
      className={composeRenderProps(className, (cls) => cn("group flex flex-col gap-2", cls))}
    >
      {(renderProps) => (
        <>
          {label && (
            <Label>
              {label}
              {props.isRequired && <span className="ml-1 text-destructive">*</span>}
            </Label>
          )}
          <div
            className={cn(
              "flex gap-4",
              orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col gap-2",
            )}
          >
            {typeof children === "function" ? children(renderProps) : children}
          </div>
          {description && (
            <RACText slot="description" className="text-xs text-muted-foreground">
              {description}
            </RACText>
          )}
          {(errorMessage || error) && <FieldError>{errorMessage || error}</FieldError>}
        </>
      )}
    </RACRadioGroup>
  );
}

export interface RadioProps extends RACRadioProps {
  description?: ReactNode;
}

export function Radio({ className, children, description, ...props }: RadioProps) {
  return (
    <RACRadio
      {...props}
      className={composeRenderProps(className, (cls) =>
        cn(
          "group flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          cls,
        ),
      )}
    >
      {(renderProps) => (
        <>
          <div
            className={cn(
              "aspect-square size-4 rounded-full border border-primary text-primary flex items-center justify-center transition-colors ring-offset-background",
              "group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
              "group-selected:bg-primary group-selected:text-primary-foreground",
              "group-disabled:cursor-not-allowed group-disabled:opacity-50",
            )}
          >
            {renderProps.isSelected && <div className="size-1.5 rounded-full bg-background" />}
          </div>
          <div className="flex flex-col">
            {typeof children === "function" ? children(renderProps) : children}
            {description && <span className="text-xs text-muted-foreground">{description}</span>}
          </div>
        </>
      )}
    </RACRadio>
  );
}
