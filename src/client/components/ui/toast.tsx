import {
  UNSTABLE_ToastRegion as RACToastRegion,
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as RACToastContent,
  Button as RACButton,
  Text,
  type ToastProps,
  type ToastRegionProps as RACToastRegionProps,
} from "react-aria-components";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { toastQueue, type ToastContent, toast } from "../../utils/toast.ts";
import { useI18n } from "../../hooks/useI18n.ts";
import { cn } from "../../utils/cn.ts";

export { toast, toastQueue, type ToastContent };

export interface ToastItemProps {
  toast: ToastProps<ToastContent>["toast"];
}

export function ToastItem({ toast: item }: ToastItemProps) {
  const { content } = item;
  const isError = content.type === "error";
  const isSuccess = content.type === "success";
  const isWarning = content.type === "warning";

  return (
    <RACToast
      toast={item}
      className={cn(
        "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border bg-background p-4 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200",
        isError && "border-destructive/40 text-destructive bg-destructive/5",
        isSuccess && "border-success/40 text-foreground bg-success/5",
        isWarning && "border-warning/40 text-foreground bg-warning/5",
        !isError && !isSuccess && !isWarning && "border-border text-foreground",
      )}
    >
      <div className="shrink-0 pt-0.5">
        {isError && <AlertCircle className="size-5 text-destructive" aria-hidden="true" />}
        {isSuccess && <CheckCircle2 className="size-5 text-success" aria-hidden="true" />}
        {isWarning && <AlertTriangle className="size-5 text-warning" aria-hidden="true" />}
        {!isError && !isSuccess && !isWarning && (
          <Info className="size-5 text-primary" aria-hidden="true" />
        )}
      </div>
      <RACToastContent className="flex min-w-0 flex-1 flex-col gap-1">
        <Text slot="title" className="text-sm font-semibold leading-tight text-foreground">
          {content.title}
        </Text>
        {content.description && (
          <Text slot="description" className="text-xs text-muted-foreground leading-normal">
            {content.description}
          </Text>
        )}
      </RACToastContent>
      <RACButton
        slot="close"
        aria-label="Close"
        className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background"
      >
        <X className="size-4" aria-hidden="true" />
      </RACButton>
    </RACToast>
  );
}

export interface ToastRegionProps extends Omit<
  Partial<RACToastRegionProps<ToastContent>>,
  "className"
> {
  className?: string | undefined;
}

export function ToastRegion({ className, ...props }: ToastRegionProps) {
  const { t } = useI18n();

  return (
    <RACToastRegion
      {...props}
      queue={toastQueue}
      aria-label={t("common.notifications")}
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex max-h-screen w-full max-w-sm flex-col items-center gap-2 pointer-events-none outline-none",
        className,
      )}
    >
      {({ toast: item }) => <ToastItem key={item.key} toast={item} />}
    </RACToastRegion>
  );
}
