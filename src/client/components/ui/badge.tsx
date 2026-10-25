import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline: "text-foreground border-border",
        success:
          "border-transparent bg-success text-success-foreground shadow-xs hover:bg-success/90",
        warning:
          "border-transparent bg-warning text-warning-foreground shadow-xs hover:bg-warning/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  color?: string | undefined;
}

export function Badge({ className, variant, color, ...props }: BadgeProps) {
  const resolvedVariant =
    variant ??
    (color === "success"
      ? "success"
      : color === "warning" || color === "warn" || color === "gold"
        ? "warning"
        : color === "destructive" || color === "error"
          ? "destructive"
          : color === "secondary" || color === "default"
            ? "secondary"
            : color === "outline"
              ? "outline"
              : "default");

  return <div className={cn(badgeVariants({ variant: resolvedVariant }), className)} {...props} />;
}
