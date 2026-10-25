import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export interface FieldItemProps {
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FieldItem({ label, required, error, children, className }: FieldItemProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export function getFieldError(field: AnyFieldApi): string | undefined {
  const errors = field.state.meta.errors;
  if (!errors || errors.length === 0) return undefined;
  const first: unknown = errors[0];
  if (typeof first === "string") return first;
  if (
    typeof first === "object" &&
    first !== null &&
    "message" in first &&
    typeof first.message === "string"
  ) {
    return first.message;
  }
  return undefined;
}
