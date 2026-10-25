import {
  Select as RACSelect,
  SelectValue as RACSelectValue,
  Button as RACButton,
  Popover as RACPopover,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  type ListBoxItemProps,
  type Key,
  composeRenderProps,
} from "react-aria-components";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export interface SelectOption<T = string | number> {
  label: ReactNode;
  value: T;
  disabled?: boolean | undefined;
}

export interface SelectProps {
  label?: ReactNode | undefined;
  placeholder?: string | undefined;
  errorMessage?: ReactNode | undefined;
  options?: SelectOption[] | undefined;
  value?: string | number | null | undefined;
  onChange?: ((value: string | number | null) => void) | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  selectedKey?: Key | null | undefined;
  onSelectionChange?: ((key: Key | null) => void) | undefined;
  isDisabled?: boolean | undefined;
  disabled?: boolean | undefined;
  "aria-label"?: string | undefined;
}

export function Select({
  label,
  placeholder,
  errorMessage,
  options,
  value,
  onChange,
  children,
  className,
  selectedKey,
  onSelectionChange,
  isDisabled,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: SelectProps) {
  const shouldDisable = isDisabled ?? disabled;
  const resolvedSelectedKey =
    selectedKey !== undefined
      ? selectedKey
      : value !== undefined && value !== null
        ? String(value)
        : null;

  const handleSelectionChange = (key: Key | null) => {
    onSelectionChange?.(key);
    if (onChange !== undefined) {
      if (key === null) {
        onChange(null);
      } else if (typeof value === "number") {
        onChange(Number(key));
      } else {
        onChange(String(key));
      }
    }
  };

  return (
    <RACSelect
      {...props}
      selectedKey={resolvedSelectedKey}
      onSelectionChange={handleSelectionChange}
      {...(shouldDisable !== undefined ? { isDisabled: shouldDisable } : {})}
      {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
      className={composeRenderProps(className, (cls) => cn("flex flex-col gap-1.5 w-full", cls))}
    >
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <RACButton
        className={cn(
          "inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <RACSelectValue className="flex-1 text-left truncate data-placeholder:text-muted-foreground">
          {({ defaultChildren, isPlaceholder }) =>
            isPlaceholder ? (placeholder ?? defaultChildren) : defaultChildren
          }
        </RACSelectValue>
        <ChevronDown className="size-4 opacity-50 shrink-0 ml-2" />
      </RACButton>
      {errorMessage && <span className="text-xs text-destructive">{errorMessage}</span>}
      <RACPopover
        offset={4}
        className={cn(
          "z-50 min-w-(--trigger-width) max-h-60 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-hidden",
          "data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 duration-150",
          "data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 duration-100",
        )}
      >
        <RACListBox
          {...(options !== undefined ? { items: options } : {})}
          className="outline-hidden p-1 flex flex-col gap-0.5"
        >
          {children ??
            ((item: SelectOption) => (
              <SelectItem
                id={String(item.value)}
                key={String(item.value)}
                textValue={typeof item.label === "string" ? item.label : String(item.value)}
              >
                {item.label}
              </SelectItem>
            ))}
        </RACListBox>
      </RACPopover>
    </RACSelect>
  );
}

export function SelectItem({ className, children, ...props }: ListBoxItemProps) {
  return (
    <RACListBoxItem
      {...props}
      className={composeRenderProps(className, (cls, { isFocused, isSelected, isDisabled }) =>
        cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-hidden transition-colors",
          isFocused && "bg-muted text-foreground",
          isSelected && "bg-muted font-medium text-foreground",
          isDisabled && "pointer-events-none opacity-50",
          cls,
        ),
      )}
    >
      {(renderProps) => (
        <>
          <span className="truncate">
            {typeof children === "function" ? children(renderProps) : children}
          </span>
          {renderProps.isSelected && (
            <span className="absolute right-2 flex size-3.5 items-center justify-center text-primary">
              <Check className="size-4" />
            </span>
          )}
        </>
      )}
    </RACListBoxItem>
  );
}
