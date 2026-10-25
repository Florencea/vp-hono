import { Dialog, DialogTrigger, Popover, type PopoverProps } from "react-aria-components";
import { AlertCircle } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import React from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import { cn } from "../../utils/cn.ts";
import { Button } from "./button.tsx";

export interface PopconfirmProps {
  title: ReactNode;
  description?: ReactNode;
  onConfirm?: (e?: React.MouseEvent) => void;
  onCancel?: (e?: React.MouseEvent) => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  okType?: "primary" | "default" | "danger";
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
  okType = "primary",
  placement = "top",
  children,
  disabled = false,
}: PopconfirmProps) {
  const { locale } = useI18n();

  if (disabled) {
    return children;
  }

  const defaultOkText = locale === "zh-TW" ? "確定" : "OK";
  const defaultCancelText = locale === "zh-TW" ? "取消" : "Cancel";

  return (
    <DialogTrigger>
      {children}
      <Popover
        placement={placement}
        className={({ isEntering, isExiting }) =>
          cn(
            "z-50 rounded-lg border border-border bg-background p-3 shadow-lg outline-none min-w-45 max-w-xs",
            isEntering && "animate-in fade-in zoom-in-95 duration-150 ease-out",
            isExiting && "animate-out fade-out zoom-out-95 duration-100 ease-in",
          )
        }
      >
        <div role="tooltip">
          <Dialog className="outline-none flex flex-col gap-2">
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
                    {cancelText ?? defaultCancelText}
                  </Button>
                  <Button
                    size="sm"
                    variant={okType === "danger" ? "destructive" : "default"}
                    onClick={(e) => {
                      onConfirm?.(e);
                      close();
                    }}
                  >
                    {okText ?? defaultOkText}
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
