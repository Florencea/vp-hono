import { Dialog, DialogTrigger, Popover, type PopoverProps } from "react-aria-components";
import { AlertCircle } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import type React from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import { cn } from "../../utils/cn.ts";
import { Button, type ButtonVariant } from "./button.tsx";

export interface PopconfirmProps {
  title: ReactNode;
  description?: ReactNode;
  onConfirm?: (e?: React.MouseEvent) => void;
  onCancel?: (e?: React.MouseEvent) => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  okVariant?: ButtonVariant;
  placement?: PopoverProps["placement"];
  children: ReactElement;
  disabled?: boolean;
}

export function Popconfirm({
  title,
  description,
  onConfirm,
  onCancel,
  okText,
  cancelText,
  okVariant = "destructive",
  placement = "top",
  children,
  disabled = false,
}: PopconfirmProps) {
  const { t } = useI18n();

  if (disabled) {
    return children;
  }

  const resolvedOkText = okText ?? t("common.ok");
  const resolvedCancelText = cancelText ?? t("common.cancel");

  return (
    <DialogTrigger>
      {children}
      <Popover
        placement={placement}
        offset={6}
        className={cn(
          "z-50 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg outline-hidden min-w-48 max-w-xs",
          "data-entering:animate-in data-entering:fade-in data-entering:zoom-in-95 duration-150",
          "data-exiting:animate-out data-exiting:fade-out data-exiting:zoom-out-95 duration-100",
        )}
      >
        <div role="tooltip">
          <Dialog className="outline-hidden flex flex-col gap-2">
            {({ close }) => (
              <>
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 text-warning mt-0.5 shrink-0" />
                  <div className="text-sm font-medium text-foreground">{title}</div>
                </div>
                {description && (
                  <div className="text-xs text-muted-foreground ml-6">{description}</div>
                )}
                <div className="flex justify-end gap-1.5 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      onCancel?.(e);
                      close();
                    }}
                  >
                    {resolvedCancelText}
                  </Button>
                  <Button
                    size="sm"
                    variant={okVariant}
                    onClick={(e) => {
                      onConfirm?.(e);
                      close();
                    }}
                  >
                    {resolvedOkText}
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </div>
      </Popover>
    </DialogTrigger>
  );
}
