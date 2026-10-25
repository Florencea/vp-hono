import {
  Checkbox as RACCheckbox,
  type CheckboxProps as RACCheckboxProps,
  composeRenderProps,
} from "react-aria-components";
import { Check, Minus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export interface CheckboxProps extends RACCheckboxProps {
  children?:
    | ReactNode
    | ((values: {
        isSelected: boolean;
        isIndeterminate: boolean;
        isHovered: boolean;
        isPressed: boolean;
        isFocused: boolean;
        isFocusVisible: boolean;
        isDisabled: boolean;
        isReadOnly: boolean;
        isInvalid: boolean;
      }) => ReactNode);
}

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <RACCheckbox
      {...props}
      className={composeRenderProps(className, (cls, { isDisabled }) =>
        cn(
          "group flex items-center gap-2 text-sm font-normal text-foreground select-none cursor-pointer",
          isDisabled && "cursor-not-allowed opacity-50",
          cls,
        ),
      )}
    >
      {(renderProps) => {
        const { isSelected, isIndeterminate, isFocusVisible } = renderProps;
        const isCheckedOrIndeterminate = isSelected || isIndeterminate;

        return (
          <>
            <div
              className={cn(
                "pointer-events-none flex size-4 shrink-0 items-center justify-center rounded-sm border border-input shadow-xs transition-colors",
                isCheckedOrIndeterminate
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background group-hover:border-primary/60",
                isFocusVisible && "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )}
            >
              {isIndeterminate ? (
                <Minus className="size-3 stroke-3" />
              ) : isSelected ? (
                <Check className="size-3 stroke-3" />
              ) : null}
            </div>
            {typeof children === "function" ? children(renderProps) : children}
          </>
        );
      }}
    </RACCheckbox>
  );
}
