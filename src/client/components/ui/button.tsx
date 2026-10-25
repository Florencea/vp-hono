import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 pressed:bg-primary/80 hovered:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 pressed:bg-destructive/80 hovered:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-muted pressed:bg-muted/80 hovered:bg-muted",
        ghost: "hover:bg-muted pressed:bg-muted/80 hovered:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "md" | "lg" | "icon";

const mapAntdTypeToVariant = (type?: string, danger?: boolean): ButtonVariant | undefined => {
  if (danger) return "destructive";
  switch (type) {
    case "primary":
      return "default";
    case "link":
      return "link";
    case "text":
      return "ghost";
    case "default":
    case "dashed":
      return "outline";
    default:
      return undefined;
  }
};

const mapAntdSizeToSize = (size?: string): ButtonSize | undefined => {
  switch (size) {
    case "small":
      return "sm";
    case "middle":
      return "default";
    case "large":
      return "lg";
    case "sm":
    case "md":
    case "lg":
    case "icon":
    case "default":
      return size;
    default:
      return undefined;
  }
};

export interface ButtonProps
  extends
    Omit<RACButtonProps, "className" | "type">,
    Omit<VariantProps<typeof buttonVariants>, "size"> {
  className?: RACButtonProps["className"];
  size?: ButtonSize | "small" | "middle" | "large";
  type?: "primary" | "default" | "dashed" | "link" | "text" | "button" | "submit" | "reset";
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}

export function Button({
  className,
  variant,
  size,
  type,
  danger,
  disabled,
  isDisabled,
  ...props
}: ButtonProps) {
  const resolvedVariant = variant ?? mapAntdTypeToVariant(type, danger) ?? "default";
  const resolvedSize = mapAntdSizeToSize(size) ?? "default";
  const isHtmlType = type === "button" || type === "submit" || type === "reset";
  const shouldDisable = disabled ?? isDisabled;

  return (
    <RACButton
      {...props}
      {...(isHtmlType ? { type } : {})}
      {...(shouldDisable !== undefined ? { isDisabled: shouldDisable } : {})}
      className={composeRenderProps(className, (cls) =>
        cn(buttonVariants({ variant: resolvedVariant, size: resolvedSize, className: cls })),
      )}
    />
  );
}
