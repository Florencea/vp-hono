import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { cn } from "../../utils/cn.ts";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 pressed:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 pressed:bg-destructive/80",
        outline:
          "border border-input bg-background shadow-xs hover:bg-muted hover:text-foreground pressed:bg-muted/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 pressed:bg-secondary/70",
        ghost: "hover:bg-muted hover:text-foreground pressed:bg-muted/80",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
        "link-destructive": "text-destructive underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "link-destructive";

export interface ButtonProps
  extends Omit<RACButtonProps, "className" | "type">, VariantProps<typeof buttonVariants> {
  className?: RACButtonProps["className"] | undefined;
  children?: ReactNode | undefined;
  disabled?: boolean | undefined;
  title?: string | undefined;
  type?: "button" | "submit" | "reset" | undefined;
}

export function Button({
  className,
  variant,
  size,
  isDisabled,
  disabled,
  type,
  ...props
}: ButtonProps) {
  const shouldDisable = isDisabled ?? disabled;

  return (
    <RACButton
      {...props}
      {...(type !== undefined ? { type } : {})}
      {...(shouldDisable !== undefined ? { isDisabled: shouldDisable } : {})}
      className={composeRenderProps(className, (cls) =>
        cn(buttonVariants({ variant, size, className: cls })),
      )}
    />
  );
}
