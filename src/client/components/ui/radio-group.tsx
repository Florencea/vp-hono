import {
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
  type RadioProps as RACRadioProps,
  composeRenderProps,
} from "react-aria-components";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export interface RadioGroupProps extends Omit<
  RACRadioGroupProps,
  "children" | "value" | "onChange"
> {
  label?: ReactNode | undefined;
  errorMessage?: ReactNode | undefined;
  children: ReactNode;
  value?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
}

export function RadioGroup({
  label,
  errorMessage,
  className,
  children,
  isDisabled,
  value,
  onChange,
  ...props
}: RadioGroupProps) {
  return (
    <RACRadioGroup
      {...props}
      {...(value !== undefined ? { value } : {})}
      {...(onChange !== undefined ? { onChange } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      className={composeRenderProps(className, (cls) => cn("flex flex-col gap-2", cls))}
    >
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <div className="flex flex-wrap gap-4">{children}</div>
      {errorMessage && <span className="text-xs text-destructive">{errorMessage}</span>}
    </RACRadioGroup>
  );
}

export interface RadioProps extends RACRadioProps {
  children?: ReactNode;
}

export function Radio({ className, children, isDisabled, ...props }: RadioProps) {
  return (
    <RACRadio
      {...props}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      className={composeRenderProps(className, (cls, { isDisabled: isRadioDisabled }) =>
        cn(
          "group flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer select-none",
          isRadioDisabled && "cursor-not-allowed opacity-50 pointer-events-none",
          cls,
        ),
      )}
    >
      {(renderProps) => (
        <>
          <div
            className={cn(
              "pointer-events-none flex size-4 shrink-0 items-center justify-center rounded-full border border-primary text-primary transition-colors",
              renderProps.isFocusVisible && "ring-2 ring-ring ring-offset-2",
              renderProps.isSelected && "border-primary",
              renderProps.isDisabled && "opacity-50",
            )}
          >
            {renderProps.isSelected && <div className="size-2 rounded-full bg-primary" />}
          </div>
          {children}
        </>
      )}
    </RACRadio>
  );
}
