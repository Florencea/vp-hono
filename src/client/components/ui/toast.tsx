import {
  UNSTABLE_ToastRegion as RACToastRegion,
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as RACToastContent,
  Text,
  type ToastProps,
  type ToastRegionProps as RACToastRegionProps,
} from "react-aria-components";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { toastQueue, type ToastContent, toast } from "../../utils/toast.ts";
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
        "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border bg-background p-4 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-200",
        isError && "border-destructive/40 text-destructive bg-destructive/5",
        isSuccess && "border-success/40 text-foreground bg-success/5",
        isWarning && "border-warning/40 text-foreground bg-warning/5",
        !isError && !isSuccess && !isWarning && "border-border text-foreground",
      )}
    >
      <div className="shrink-0 pt-0.5">
        {isError && <AlertCircle className="size-5 text-destructive" />}
        {isSuccess && <CheckCircle2 className="size-5 text-success" />}
        {isWarning && <AlertTriangle className="size-5 text-warning" />}
        {!isError && !isSuccess && !isWarning && <Info className="size-5 text-primary" />}
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
      <button
        slot="close"
        type="button"
        aria-label="Close"
        className="rounded-md p-1 opacity-70 hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <X className="size-4" />
      </button>
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
  return (
    <RACToastRegion
      {...props}
      queue={toastQueue}
      className={cn(
        "fixed bottom-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 pointer-events-none outline-none",
        className,
      )}
    >
      {({ toast: item }) => <ToastItem key={item.key} toast={item} />}
    </RACToastRegion>
  );
}
