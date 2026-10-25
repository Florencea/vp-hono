import { DialogTrigger, Popover } from "react-aria-components";
import { Check, ChevronDown, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "../../utils/cn.ts";
import { Badge } from "./badge.tsx";

export interface MultiSelectOption<T = string | number> {
  label: ReactNode;
  value: T;
  disabled?: boolean | undefined;
}

export interface MultiSelectProps<T = string | number> {
  label?: ReactNode | undefined;
  placeholder?: string | undefined;
  errorMessage?: ReactNode | undefined;
  options?: MultiSelectOption<T>[] | undefined;
  value?: T[] | undefined;
  onChange?: ((values: T[]) => void) | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

export function MultiSelect<T extends string | number>({
  label,
  placeholder = "Select options...",
  errorMessage,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const resolvedOptions = options ?? [];
  const resolvedValue = value ?? [];

  const selectedOptions = resolvedOptions.filter((opt) =>
    resolvedValue.some((v) => String(v) === String(opt.value)),
  );

  const toggleOption = (val: T) => {
    const exists = resolvedValue.some((v) => String(v) === String(val));
    const next = exists
      ? resolvedValue.filter((v) => String(v) !== String(val))
      : [...resolvedValue, val];
    onChange?.(next);
  };

  const removeOption = (val: T) => {
    onChange?.(resolvedValue.filter((v) => String(v) !== String(val)));
  };

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex min-h-9 w-full flex-wrap items-center justify-between gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-ring",
            disabled && "cursor-not-allowed opacity-50 pointer-events-none",
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground select-none">{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => {
                const optLabelStr = typeof opt.label === "string" ? opt.label : String(opt.value);
                return (
                  <Badge
                    key={String(opt.value)}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1 text-xs"
                  >
                    <span>{opt.label}</span>
                    {!disabled && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(opt.value);
                        }}
                        className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                        aria-label={`Remove ${optLabelStr}`}
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </Badge>
                );
              })
            )}
          </div>
          <ChevronDown className="size-4 opacity-50 shrink-0 ml-2" />
        </div>

        <Popover
          offset={4}
          className={cn(
            "z-50 min-w-(--trigger-width) max-h-60 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-hidden",
            "data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 duration-150",
            "data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 duration-100",
          )}
        >
          <div role="listbox" className="flex flex-col gap-0.5">
            {resolvedOptions.map((opt) => {
              const isSelected = resolvedValue.some((v) => String(v) === String(opt.value));
              return (
                <div
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => !(opt.disabled === true) && toggleOption(opt.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-hidden transition-colors hover:bg-muted",
                    isSelected && "bg-muted font-medium",
                    opt.disabled === true && "pointer-events-none opacity-50",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <span className="absolute right-2 flex size-3.5 items-center justify-center text-primary">
                      <Check className="size-4" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Popover>
      </DialogTrigger>
      {errorMessage && <span className="text-xs text-destructive">{errorMessage}</span>}
    </div>
  );
}
