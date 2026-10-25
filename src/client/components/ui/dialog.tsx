import {
  Dialog as RACDialog,
  Modal,
  ModalOverlay,
  DialogTrigger as RACDialogTrigger,
  Heading,
  type HeadingProps,
} from "react-aria-components";
import { X } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export const DialogTrigger = RACDialogTrigger;

export interface DialogContentProps {
  children: ReactNode;
  isOpen?: boolean | undefined;
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  isDismissable?: boolean | undefined;
  className?: string | undefined;
  overlayClassName?: string | undefined;
  showCloseButton?: boolean | undefined;
  "aria-label"?: string | undefined;
}

export function DialogContent({
  children,
  isOpen,
  onOpenChange,
  isDismissable = true,
  className,
  overlayClassName,
  showCloseButton = true,
  "aria-label": ariaLabel,
}: DialogContentProps) {
  return (
    <ModalOverlay
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      isDismissable={isDismissable}
      className={cn(
        "fixed inset-0 z-50 flex min-h-full items-center justify-center p-4 bg-black/60 backdrop-blur-xs",
        "data-entering:animate-in data-[entering]:fade-in duration-200",
        "data-exiting:animate-out data-[exiting]:fade-out duration-150",
        overlayClassName,
      )}
    >
      <Modal
        className={cn(
          "relative w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-xl",
          "data-entering:animate-in data-entering:zoom-in-95 duration-200",
          "data-exiting:animate-out data-exiting:zoom-out-95 duration-150",
          className,
        )}
      >
        <RACDialog
          role="dialog"
          className="outline-none flex flex-col gap-4"
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
                  className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-ring"
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

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-left", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: HeadingProps) {
  return (
    <Heading
      slot="title"
      className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
