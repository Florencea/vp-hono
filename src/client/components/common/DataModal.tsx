import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import { cn } from "../../utils/cn.ts";
import { Button } from "../ui/button.tsx";

export interface DataModalProps {
  open?: boolean | undefined;
  isOpen?: boolean | undefined;
  title?: ReactNode | undefined;
  onCancel?: (() => void) | undefined;
  onOk?: (() => void) | undefined;
  confirmLoading?: boolean | undefined;
  okText?: ReactNode | undefined;
  cancelText?: ReactNode | undefined;
  footer?: ReactNode | null | undefined;
  width?: number | string | undefined;
  destroyOnHidden?: boolean | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  closable?: boolean | undefined;
  mask?: boolean | { closable?: boolean } | undefined;
  maskClosable?: boolean | undefined;
}

const UNTIL_FOUND_ATTR: Record<string, string> = { hidden: "until-found" };

export function DataModal({
  open,
  isOpen: propIsOpen,
  title,
  onCancel,
  onOk,
  confirmLoading = false,
  okText,
  cancelText,
  footer,
  width = 520,
  destroyOnHidden = true,
  children,
  className,
  closable = true,
  mask,
  maskClosable: propMaskClosable,
}: DataModalProps) {
  const { locale } = useI18n();
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

  const defaultOkText = locale === "zh-TW" ? "確 定" : "OK";
  const defaultCancelText = locale === "zh-TW" ? "取 消" : "Cancel";

  const resolvedWidthStyle =
    width !== undefined
      ? { maxWidth: typeof width === "number" ? `${width}px` : width }
      : undefined;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(openState) => {
        if (!openState) onCancel?.();
      }}
      isDismissable={isMaskClosable}
      className={({ isEntering, isExiting }) =>
        cn(
          "fixed inset-0 z-50 flex min-h-full items-center justify-center p-4 text-center bg-black/50 backdrop-blur-xs",
          isEntering && "animate-in fade-in duration-200 ease-out",
          isExiting && "animate-out fade-out duration-150 ease-in",
        )
      }
    >
      <Modal
        className={({ isEntering, isExiting }) =>
          cn(
            "w-full max-w-lg rounded-xl bg-background p-6 text-left align-middle shadow-xl border border-border transition-all",
            isEntering && "animate-in zoom-in-95 duration-200 ease-out",
            isExiting && "animate-out zoom-out-95 duration-150 ease-in",
            className,
          )
        }
        {...(resolvedWidthStyle !== undefined ? { style: resolvedWidthStyle } : {})}
      >
        <Dialog role="dialog" className="outline-none relative flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            {title ? (
              <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {closable && (
              <button
                type="button"
                onClick={onCancel}
                aria-label="Close"
                className="rounded-sm opacity-70 hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="py-2 text-foreground">{children}</div>

          {/* Footer */}
          {footer !== null && (
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              {footer ?? (
                <>
                  <Button
                    variant="outline"
                    {...(onCancel !== undefined ? { onClick: onCancel } : {})}
                  >
                    {cancelText ?? defaultCancelText}
                  </Button>
                  <Button
                    variant="default"
                    loading={confirmLoading}
                    {...(onOk !== undefined ? { onClick: onOk } : {})}
                  >
                    {okText ?? defaultOkText}
                  </Button>
                </>
              )}
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
