import { UNSTABLE_ToastQueue as ToastQueue } from "react-aria-components";

export interface ToastContent {
  title: string;
  description?: string | undefined;
  type?: "success" | "error" | "info" | "warning" | undefined;
}

export const toastQueue = new ToastQueue<ToastContent>({
  maxVisibleToasts: 5,
});

let lastToastMessage = "";
let lastToastTime = 0;
const DEDUP_WINDOW_MS = 300;

function addToast(content: ToastContent, timeout = 5000): string | undefined {
  const now = Date.now();
  const key = `${content.type ?? "info"}:${content.title}:${content.description ?? ""}`;
  if (key === lastToastMessage && now - lastToastTime < DEDUP_WINDOW_MS) {
    return undefined;
  }
  lastToastMessage = key;
  lastToastTime = now;
  return toastQueue.add(content, { timeout });
}

export const toast = {
  success: (title: string, description?: string) =>
    addToast({ title, description, type: "success" }, 5000),
  error: (title: string, description?: string) =>
    addToast({ title, description, type: "error" }, 6000),
  info: (title: string, description?: string) =>
    addToast({ title, description, type: "info" }, 5000),
  warning: (title: string, description?: string) =>
    addToast({ title, description, type: "warning" }, 5000),
};
