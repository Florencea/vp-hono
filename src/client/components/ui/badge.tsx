import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-muted text-muted-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        primary: "border-primary/20 bg-primary/10 text-primary",
        success: "border-success/20 bg-success/10 text-success",
        error: "border-destructive/20 bg-destructive/10 text-destructive",
        gold: "border-gold/20 bg-gold/10 text-gold",
        purple: "border-purple/20 bg-purple/10 text-purple",
        blue: "border-blue/20 bg-blue/10 text-blue",
        cyan: "border-cyan/20 bg-cyan/10 text-cyan",
        orange: "border-orange/20 bg-orange/10 text-orange",
        geekblue: "border-geekblue/20 bg-geekblue/10 text-geekblue",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const mapColorToVariant = (color?: string): BadgeVariant => {
  if (!color) return undefined;
  switch (color) {
    case "gold":
      return "gold";
    case "success":
      return "success";
    case "error":
      return "error";
    case "blue":
      return "blue";
    case "purple":
      return "purple";
    case "cyan":
      return "cyan";
    case "orange":
      return "orange";
    case "geekblue":
      return "geekblue";
    case "primary":
      return "primary";
    case "default":
      return "secondary";
    default:
      return "secondary";
  }
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  color?: string;
}

export function Badge({ className, variant, color, ...props }: BadgeProps) {
  const resolvedVariant = variant ?? mapColorToVariant(color) ?? "default";
  return <div className={cn(badgeVariants({ variant: resolvedVariant }), className)} {...props} />;
}
