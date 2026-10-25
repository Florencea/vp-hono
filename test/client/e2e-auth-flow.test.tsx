import { afterEach, expect, test, vi } from "vite-plus/test";
import { LoginReqSchema } from "../../src/server/routes/auth/auth.schema.ts";
import { renderAppAt } from "./test-utils";

const originalFetch = window.fetch.bind(window);

function interceptReload() {
  const reloadSpy = vi.fn<() => void>();
  if ("navigation" in window && window.navigation) {
    const nav = window.navigation;
    const handler = (e: Event) => {
      if ("navigationType" in e && e.navigationType === "reload") {
        reloadSpy();
        e.preventDefault();
      }
    };
    nav.addEventListener("navigate", handler);
    return {
      reloadSpy,
      restore: () => nav.removeEventListener("navigate", handler),
    };
  }
  return {
    reloadSpy,
    restore: () => {},
  };
}

afterEach(() => {
  window.fetch = originalFetch;
});

test("Auth Flow: clicking logout sends POST /api/auth/logout and triggers window.location.reload", async () => {
  let logoutDispatched = false;
  let logoutMethod = "";

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (url.includes("/api/auth/getUserInfo")) {
      return new Response(
        JSON.stringify({
          success: true,
          id: 1,
          account: "admin",
          name: "System Administrator",
          employeeNo: "ADM001",
          title: "Admin",
          departmentId: 1,
          roles: ["super_admin"],
          permissions: [],
          dataScopes: ["ALL"],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (url.includes("/api/auth/logout")) {
      logoutDispatched = true;
      logoutMethod = init?.method ?? "GET";
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return originalFetch(input, init);
  };

  const interceptor = interceptReload();

  try {
    const screen = await renderAppAt("/");

    const logoutBtn = screen.getByRole("button", { name: /logout|登出/i });
    await expect.element(logoutBtn).toBeVisible();
    await logoutBtn.click();

    await vi.waitFor(() => {
      expect(logoutDispatched).toBe(true);
      expect(interceptor.reloadSpy).toHaveBeenCalled();
    });

    expect(logoutMethod).toBe("POST");
  } finally {
    interceptor.restore();
  }
});

test("Auth Flow: unauthenticated state redirects to /login and hides Header and Sidebar navigation", async () => {
  // setup.ts defaults /api/auth/getUserInfo to { success: false, account: null }
  const screen = await renderAppAt("/");

  // Wait for login page button to be visible, ensuring router beforeLoad redirect has resolved
  const submitBtn = screen.getByRole("button", { name: /submit|送出/i });
  await expect.element(submitBtn).toBeVisible();

  // Verify TanStack Router redirected to /login
  expect(screen.router.state.location.pathname).toBe("/login");

  // Verify Header logout button and navigation menu are not present in unauthenticated layout
  const logoutBtn = screen.getByRole("button", { name: /logout|登出/i });
  await expect.element(logoutBtn).not.toBeInTheDocument();

  const navigationMenu = screen.getByRole("menu");
  await expect.element(navigationMenu).not.toBeInTheDocument();
});

test("Auth Flow: submitting login credentials sends POST /api/auth/login conforming to LoginReqSchema and reloads on success", async () => {
  let dispatchedUrl = "";
  let dispatchedMethod = "";
  let dispatchedPayload: unknown = null;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (url.includes("/api/auth/login")) {
      dispatchedUrl = url;
      dispatchedMethod = init?.method ?? "GET";
      if (init?.body && typeof init.body === "string") {
        try {
          dispatchedPayload = JSON.parse(init.body);
        } catch {
          dispatchedPayload = init.body;
        }
      }
      return new Response(JSON.stringify({ success: true, account: "admin" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return originalFetch(input, init);
  };

  const interceptor = interceptReload();

  try {
    const screen = await renderAppAt("/login");

    const accountInput = screen.getByRole("textbox", { name: /account|帳號/i });
    const passwordInput = screen.getByLabelText(/password|密碼/i);
    const submitBtn = screen.getByRole("button", { name: /submit|送出/i });

    await accountInput.fill("admin");
    await passwordInput.fill("password123");
    await submitBtn.click();

    await vi.waitFor(() => {
      expect(dispatchedUrl).toContain("/api/auth/login");
      expect(interceptor.reloadSpy).toHaveBeenCalled();
    });

    expect(dispatchedMethod).toBe("POST");

    const parsed = LoginReqSchema.safeParse(dispatchedPayload);
    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual({
      account: "admin",
      password: "password123",
    });
  } finally {
    interceptor.restore();
  }
});
