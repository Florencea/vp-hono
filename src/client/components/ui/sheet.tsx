import {
  Dialog as RACDialog,
  Modal,
  ModalOverlay,
  DialogTrigger as RACDialogTrigger,
  Heading,
  type HeadingProps,
} from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export const SheetTrigger = RACDialogTrigger;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-xl transition ease-in-out border-border overflow-y-auto flex flex-col",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[entering]:animate-in data-[entering]:slide-in-from-top duration-200 data-[exiting]:animate-out data-[exiting]:slide-out-to-top duration-150",
        bottom:
          "inset-x-0 bottom-0 border-t data-[entering]:animate-in data-[entering]:slide-in-from-bottom duration-200 data-[exiting]:animate-out data-[exiting]:slide-out-to-bottom duration-150",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[entering]:animate-in data-[entering]:slide-in-from-left duration-200 data-[exiting]:animate-out data-[exiting]:slide-out-to-left duration-150 sm:max-w-md",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[entering]:animate-in data-[entering]:slide-in-from-right duration-200 data-[exiting]:animate-out data-[exiting]:slide-out-to-right duration-150 sm:max-w-lg",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

export interface SheetContentProps extends VariantProps<typeof sheetVariants> {
  children: ReactNode;
  isOpen?: boolean | undefined;
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  isDismissable?: boolean | undefined;
  className?: string | undefined;
  overlayClassName?: string | undefined;
  showCloseButton?: boolean | undefined;
  "aria-label"?: string | undefined;
}

export function SheetContent({
  children,
  side = "right",
  isOpen,
  onOpenChange,
  isDismissable = true,
  className,
  overlayClassName,
  showCloseButton = true,
  "aria-label": ariaLabel,
}: SheetContentProps) {
  return (
    <ModalOverlay
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      isDismissable={isDismissable}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs",
        "data-entering:animate-in data-entering:fade-in duration-200",
        "data-exiting:animate-out data-exiting:fade-out duration-150",
        overlayClassName,
      )}
    >
      <Modal className={cn(sheetVariants({ side }), className)}>
        <RACDialog
          role="dialog"
          className="outline-none flex-1 flex flex-col gap-4"
          {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
        >
          {typeof children === "function" ? (
            children
          ) : (
            <>
              {children}
              {showCloseButton && onOpenChange !== undefined && (
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background"
                >
                  <X className="size-4" />
                </button>
              )}
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}

export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left border-b border-border pb-3", className)}
      {...props}
    />
  );
}

export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-border pt-3 mt-auto",
        className,
      )}
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }: HeadingProps) {
  return (
    <Heading
      slot="title"
      className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

export function SheetDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
