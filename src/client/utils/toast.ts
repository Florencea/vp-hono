import { UNSTABLE_ToastQueue as ToastQueue } from "react-aria-components";

export interface ToastContent {
  title: string;
  description?: string | undefined;
  type?: "success" | "error" | "info" | "warning" | undefined;
}

export const toastQueue = new ToastQueue<ToastContent>({
  maxVisibleToasts: 5,
});

export const toast = {
  success: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "success" }, { timeout: 4000 }),
  error: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "error" }, { timeout: 5000 }),
  info: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "info" }, { timeout: 4000 }),
};
