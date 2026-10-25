import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export interface DataDrawerProps {
  open?: boolean | undefined;
  isOpen?: boolean | undefined;
  title?: ReactNode | undefined;
  onClose?: (() => void) | undefined;
  extra?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  size?: "default" | "large" | undefined;
  width?: number | string | undefined;
  destroyOnHidden?: boolean | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  closable?: boolean | undefined;
  mask?: boolean | { closable?: boolean } | undefined;
  maskClosable?: boolean | undefined;
}

const UNTIL_FOUND_ATTR: Record<string, string> = { hidden: "until-found" };

export function DataDrawer({
  open,
  isOpen: propIsOpen,
  title,
  onClose,
  extra,
  footer,
  size = "default",
  width,
  destroyOnHidden = true,
  children,
  className,
  closable = true,
  mask,
  maskClosable: propMaskClosable,
}: DataDrawerProps) {
  const isOpen = propIsOpen ?? open ?? false;

  const isMaskClosable =
    propMaskClosable ?? (typeof mask === "object" ? (mask.closable ?? false) : (mask ?? false));

  // If closed and preserving in DOM, apply native hidden="until-found" accessibility standard
  if (!isOpen) {
    if (!destroyOnHidden) {
      return (
        <div {...UNTIL_FOUND_ATTR} className="hidden" aria-hidden="true">
          {children}
        </div>
      );
    }
    return null;
  }

  const resolvedWidthStyle =
    width !== undefined ? { width: typeof width === "number" ? `${width}px` : width } : undefined;

  const resolvedSizeClass =
    width === undefined ? (size === "large" ? "w-full max-w-2xl" : "w-full max-w-md") : "";

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(openState) => {
        if (!openState) onClose?.();
      }}
      isDismissable={isMaskClosable}
      className={({ isEntering, isExiting }) =>
        cn(
          "fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs",
          isEntering && "animate-in fade-in duration-200 ease-out",
          isExiting && "animate-out fade-out duration-150 ease-in",
        )
      }
    >
      <Modal
        className={({ isEntering, isExiting }) =>
          cn(
            "h-full bg-background p-6 shadow-2xl border-l border-border flex flex-col overflow-y-auto transition-transform",
            resolvedSizeClass,
            isEntering && "animate-in slide-in-from-right duration-200 ease-out",
            isExiting && "animate-out slide-out-to-right duration-150 ease-in",
            className,
          )
        }
        {...(resolvedWidthStyle !== undefined ? { style: resolvedWidthStyle } : {})}
      >
        <Dialog role="dialog" className="outline-none h-full flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              {closable && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-sm opacity-70 hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <X className="size-4" />
                </button>
              )}
              {title && (
                <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">
                  {title}
                </h2>
              )}
            </div>
            {extra && <div className="flex items-center gap-2">{extra}</div>}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-2 text-foreground">{children}</div>

          {/* Footer */}
          {footer && <div className="pt-3 border-t border-border">{footer}</div>}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
