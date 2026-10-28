import { expect, test, vi } from "vite-plus/test";
import { renderAppAt } from "./test-utils";

test("Theme System: clicking ThemeToggle updates document.documentElement dark class", async () => {
  const screen = await renderAppAt("/login");

  const themeToggle = screen.getByRole("button", { name: /switch to dark theme|切換至深色主題/i });
  await expect.element(themeToggle).toBeVisible();

  // Initially light mode
  expect(document.documentElement.classList.contains("dark")).toBe(false);

  // Toggle to dark mode
  await themeToggle.click();
  expect(document.documentElement.classList.contains("dark")).toBe(true);

  // Toggle back to light mode
  const lightToggle = screen.getByRole("button", { name: /switch to light theme|切換至淺色主題/i });
  await lightToggle.click();
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});

test("E2E Form Contract: Required validation blocks empty submission without network call", async () => {
  const fetchSpy = vi.spyOn(window, "fetch");
  const screen = await renderAppAt("/login");

  const submitBtn = screen.getByRole("button", { name: /submit|送出/i });
  await expect.element(submitBtn).toBeVisible();

  // Click submit on empty form
  await submitBtn.click();

  // TanStack Form validation displays required error message with auto-waiting
  const errorMsg = screen.getByText(/Please enter Account|請輸入帳號/i);
  await expect.element(errorMsg).toBeVisible();

  // No login network request should be dispatched by Hono RPC client
  const loginCalls = fetchSpy.mock.calls.filter(([callInput]) => {
    const url =
      typeof callInput === "string"
        ? callInput
        : callInput instanceof URL
          ? callInput.toString()
          : callInput.url;
    return url.includes("/api/auth/login");
  });
  expect(loginCalls).toHaveLength(0);
  fetchSpy.mockRestore();
});

test("E2E RPC Wire Contract: Form submission dispatches typed payload matching LoginReqSchema", async () => {
  let dispatchedPayload: unknown = null;
  let dispatchedUrl: string | undefined = undefined;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const urlStr =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (urlStr.includes("/api/auth/login")) {
      dispatchedUrl = urlStr;
      if (init?.body && typeof init.body === "string") {
        try {
          dispatchedPayload = JSON.parse(init.body);
        } catch {
          dispatchedPayload = init.body;
        }
      }
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return originalFetch(input, init);
  };

  const screen = await renderAppAt("/login");

  const accountInput = screen.getByRole("textbox", { name: /account|帳號/i });
  const passwordInput = screen.getByLabelText(/password|密碼/i);
  const submitBtn = screen.getByRole("button", { name: /submit|送出/i });

  await accountInput.fill("admin");
  await passwordInput.fill("password123");

  await submitBtn.click();

  // Verify Hono RPC endpoint and wire payload format
  expect(dispatchedUrl).toContain("/api/auth/login");
  expect(dispatchedPayload).toEqual({
    account: "admin",
    password: "password123",
  });

  // Verify the error toast is rendered via RAC ToastRegion at top-center
  const toast = screen.getByText("Invalid credentials");
  await expect.element(toast).toBeInTheDocument();
  await expect.element(toast).toBeVisible();

  const toastRegion = toast.element().closest("[aria-label]");
  expect(toastRegion?.className).toContain("top-4");
  expect(toastRegion?.className).toContain("left-1/2");

  window.fetch = originalFetch;
});
