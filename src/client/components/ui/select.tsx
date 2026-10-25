import {
  Select as RACSelect,
  type SelectProps as RACSelectProps,
  SelectValue as RACSelectValue,
  Button as RACButton,
  Popover as RACPopover,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  ListBoxSection as RACListBoxSection,
  Header as RACHeader,
  DialogTrigger,
  type ListBoxItemProps,
  type ListBoxProps,
  type PopoverProps,
  type Key as RACKey,
  composeRenderProps,
} from "react-aria-components";
import { Check, ChevronDown, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export interface SelectOption<T = string | number> {
  label: ReactNode;
  value: T;
  disabled?: boolean | undefined;
}

const EMPTY_OPTIONS: SelectOption[] = [];

export interface SelectItemProps extends Omit<ListBoxItemProps, "className" | "children"> {
  className?: ListBoxItemProps["className"];
  children: ReactNode;
}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <RACListBoxItem
      {...props}
      className={composeRenderProps(className, (cls, { isFocused, isSelected, isDisabled }) =>
        cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors",
          isFocused && "bg-muted text-foreground",
          isSelected && "bg-muted/60 font-medium text-foreground",
          isDisabled && "pointer-events-none opacity-50",
          cls,
        ),
      )}
    >
      {(renderProps) => (
        <>
          <span className="truncate">{children}</span>
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

export interface SelectSectionProps {
  title?: ReactNode | undefined;
  children: ReactNode;
  className?: string | undefined;
}

export function SelectSection({ title, children, className }: SelectSectionProps) {
  return (
    <RACListBoxSection className={cn("p-1", className)}>
      {title && (
        <RACHeader className="px-2 py-1 text-xs font-semibold text-muted-foreground">
          {title}
        </RACHeader>
      )}
      {children}
    </RACListBoxSection>
  );
}

export interface SelectValueProps {
  placeholder?: string | undefined;
  className?: string | undefined;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  return (
    <RACSelectValue
      className={cn("flex-1 text-left truncate data-placeholder:text-muted-foreground", className)}
    >
      {({ defaultChildren, isPlaceholder }) =>
        isPlaceholder ? (placeholder ?? defaultChildren) : defaultChildren
      }
    </RACSelectValue>
  );
}

export interface SelectListBoxProps<T> extends Omit<ListBoxProps<T>, "className"> {
  className?: ListBoxProps<T>["className"];
}

export function SelectListBox<T extends object>({
  className,
  children,
  ...props
}: SelectListBoxProps<T>) {
  return (
    <RACListBox
      {...props}
      className={composeRenderProps(className, (cls) =>
        cn("outline-none p-1 flex flex-col gap-0.5", cls),
      )}
    >
      {children}
    </RACListBox>
  );
}

export interface SelectProps extends Omit<
  RACSelectProps<SelectOption>,
  "children" | "value" | "onChange" | "defaultValue" | "className" | "placeholder"
> {
  label?: string | undefined;
  description?: string | undefined;
  errorMessage?: string | undefined;
  placeholder?: string | undefined;
  options?: SelectOption[] | undefined;
  value?: string | number | Array<string | number> | null | undefined;
  defaultValue?: string | number | undefined;
  onChange?: ((value: string | number | Array<string | number>) => void) | undefined;
  placement?: PopoverProps["placement"];
  mode?: "single" | "multiple" | undefined;
  allowClear?: boolean | undefined;
  children?: ReactNode | ((item: SelectOption) => ReactNode) | undefined;
  className?: RACSelectProps<SelectOption>["className"];
  disabled?: boolean | undefined;
}

export function Select({
  label,
  description,
  errorMessage,
  placeholder,
  options,
  value,
  onChange,
  placement = "bottom start",
  mode = "single",
  allowClear,
  children,
  className,
  selectedKey,
  onSelectionChange,
  disabled,
  isDisabled,
  defaultValue: _unusedDefaultValue,
  ...props
}: SelectProps) {
  if (mode === "multiple") {
    const multiValue = Array.isArray(value)
      ? value
      : value !== undefined && value !== null
        ? [value]
        : [];
    return (
      <MultiSelect
        options={options}
        value={multiValue}
        onChange={onChange}
        {...(placeholder !== undefined ? { placeholder } : {})}
        disabled={disabled ?? isDisabled}
        {...(allowClear !== undefined ? { allowClear } : {})}
        placement={placement}
        {...(typeof className === "string" ? { className } : {})}
      />
    );
  }

  const resolvedSelectedKey =
    selectedKey !== undefined
      ? selectedKey
      : value !== undefined && value !== null && !Array.isArray(value)
        ? String(value)
        : undefined;

  const handleSelectionChange = (key: RACKey | null) => {
    if (key === null) return;
    onSelectionChange?.(key);
    if (onChange) {
      if (typeof value === "number") {
        onChange(Number(key));
      } else {
        onChange(String(key));
      }
    }
  };

  const shouldDisable = disabled ?? isDisabled;

  return (
    <RACSelect
      {...props}
      {...(resolvedSelectedKey !== undefined ? { selectedKey: resolvedSelectedKey } : {})}
      onSelectionChange={handleSelectionChange}
      {...(shouldDisable !== undefined ? { isDisabled: shouldDisable } : {})}
      className={composeRenderProps(className, (cls) => cn("flex flex-col gap-1.5 w-full", cls))}
    >
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <RACButton
        className={cn(
          "inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <SelectValue {...(placeholder !== undefined ? { placeholder } : {})} />
        <ChevronDown className="size-4 opacity-50 shrink-0 ml-2" />
      </RACButton>
      {description && <span className="text-xs text-muted-foreground">{description}</span>}
      {errorMessage && <span className="text-xs text-destructive">{errorMessage}</span>}
      <RACPopover
        placement={placement}
        className={({ isEntering, isExiting }) =>
          cn(
            "z-50 min-w-(--trigger-width) max-h-60 overflow-y-auto rounded-md border border-border bg-background p-1 text-foreground shadow-md outline-none",
            isEntering && "animate-in fade-in-0 zoom-in-95 duration-150 ease-out",
            isExiting && "animate-out fade-out-0 zoom-out-95 duration-100 ease-in",
          )
        }
      >
        <SelectListBox {...(options !== undefined ? { items: options } : {})}>
          {children ??
            ((item: SelectOption) => (
              <SelectItem
                id={String(item.value)}
                key={String(item.value)}
                textValue={typeof item.label === "string" ? item.label : String(item.value)}
                {...(item.disabled !== undefined ? { isDisabled: item.disabled } : {})}
              >
                {item.label}
              </SelectItem>
            ))}
        </SelectListBox>
      </RACPopover>
    </RACSelect>
  );
}

export interface MultiSelectProps {
  options?: SelectOption[] | undefined;
  value?: Array<string | number> | undefined;
  defaultValue?: Array<string | number> | undefined;
  onChange?: ((value: Array<string | number>) => void) | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  allowClear?: boolean | undefined;
  className?: string | undefined;
  maxTagCount?: number | undefined;
  placement?: PopoverProps["placement"];
  id?: string | undefined;
  name?: string | undefined;
  "aria-label"?: string | undefined;
}

export function MultiSelect({
  options = EMPTY_OPTIONS,
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  allowClear = false,
  className,
  placement = "bottom start",
  id,
  "aria-label": ariaLabel,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<Array<string | number>>(defaultValue ?? []);

  const currentValues = isControlled ? (value ?? []) : internalValue;

  const toggleOption = (val: string | number) => {
    const exists = currentValues.some((v) => String(v) === String(val));
    const next = exists
      ? currentValues.filter((v) => String(v) !== String(val))
      : [...currentValues, val];
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const removeTag = (val: string | number) => {
    const next = currentValues.filter((v) => String(v) !== String(val));
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const clearAll = () => {
    if (!isControlled) {
      setInternalValue([]);
    }
    onChange?.([]);
  };

  const selectedOptions = options.filter((opt) =>
    currentValues.some((v) => String(v) === String(opt.value)),
  );

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <div
        {...(id !== undefined ? { id } : {})}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className={cn(
          "relative flex min-h-9 w-full flex-wrap items-center justify-between gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs ring-offset-background cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground select-none">{placeholder ?? "Select..."}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={String(opt.value)}
                className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground select-none"
              >
                <span className="truncate max-w-30">{opt.label}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(opt.value);
                    }}
                    aria-label={
                      typeof opt.label === "string"
                        ? `Remove ${opt.label}`
                        : `Remove item ${String(opt.value)}`
                    }
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20 hover:text-destructive cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {allowClear && selectedOptions.length > 0 && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              aria-label="Clear all"
              className="rounded-full p-0.5 opacity-60 hover:opacity-100 hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown className="size-4 opacity-50" />
        </div>
      </div>
      <RACPopover
        placement={placement}
        className={({ isEntering, isExiting }) =>
          cn(
            "z-50 min-w-(--trigger-width) max-h-60 overflow-y-auto rounded-md border border-border bg-background p-1 shadow-md outline-none",
            isEntering && "animate-in fade-in-0 zoom-in-95 duration-150 ease-out",
            isExiting && "animate-out fade-out-0 zoom-out-95 duration-100 ease-in",
          )
        }
      >
        <div role="listbox" aria-multiselectable="true" className="flex flex-col gap-0.5">
          {options.map((opt) => {
            const isSelected = currentValues.some((v) => String(v) === String(opt.value));
            return (
              <div
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => !opt.disabled && toggleOption(opt.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!opt.disabled) toggleOption(opt.value);
                  }
                }}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors",
                  isSelected && "bg-muted/60 font-medium",
                  opt.disabled && "pointer-events-none opacity-50",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="size-4 absolute right-2 text-primary" />}
              </div>
            );
          })}
        </div>
      </RACPopover>
    </DialogTrigger>
  );
}

export const TagPicker = MultiSelect;
