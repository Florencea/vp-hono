import { afterEach, expect, test, vi } from "vite-plus/test";
import { APP_TITLE } from "../../src/client/config.ts";
import { renderAppAt } from "./test-utils";

const originalFetch = window.fetch.bind(window);

afterEach(() => {
  window.fetch = originalFetch;
});

function mockAuthEnvironment() {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (url.includes("/api/auth/getUserInfo")) {
      return new Response(
        JSON.stringify({
          success: true,
          id: 1,
          account: "admin",
          name: "System Admin",
          employeeNo: "ADM001",
          title: "Administrator",
          departmentId: 1,
          roles: ["super_admin"],
          permissions: ["system:user:read", "system:role:read", "system:dept:read"],
          dataScopes: ["ALL"],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (url.includes("/api/departments")) {
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes("/api/roles")) {
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes("/api/users")) {
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return originalFetch(input, init);
  };
}

test("Layout: renders application logo and APP_TITLE in the header", async () => {
  mockAuthEnvironment();
  const screen = await renderAppAt("/");

  // Check branding logo
  const logo = screen.getByRole("img", { name: /logo/i });
  await expect.element(logo).toBeVisible();

  // Check system application title
  const title = screen.getByText(APP_TITLE);
  await expect.element(title).toBeVisible();
});

test("Layout: sidebar toggles collapsed and expanded states via collapse trigger", async () => {
  mockAuthEnvironment();
  const screen = await renderAppAt("/");

  const aside = screen.getByRole("complementary");
  await expect.element(aside).toBeInTheDocument();

  // Find the collapse/expand trigger icon inside the sidebar
  const triggerIcon = aside.getByRole("img", { name: /left|right/i });
  await expect.element(triggerIcon).toBeVisible();

  const initialWidth = aside.element().getBoundingClientRect().width;

  // Click the trigger to toggle state
  await triggerIcon.click();

  await vi.waitFor(() => {
    const toggledWidth = aside.element().getBoundingClientRect().width;
    expect(toggledWidth).not.toBe(initialWidth);
  });

  // Query trigger icon at new position and click again to revert
  const updatedTrigger = aside.getByRole("img", { name: /left|right/i });
  await updatedTrigger.click();

  await vi.waitFor(() => {
    const revertedWidth = aside.element().getBoundingClientRect().width;
    expect(revertedWidth).toBe(initialWidth);
  });
});

test("Layout: clicking sidebar navigation menuitems dynamically routes to corresponding views", async () => {
  mockAuthEnvironment();
  const screen = await renderAppAt("/");

  // 1. Navigate to Roles & Permissions
  const roleMenuItem = screen.getByRole("menuitem", { name: /roles|角色/i });
  await expect.element(roleMenuItem).toBeVisible();
  await roleMenuItem.click();
  expect(screen.router.state.location.pathname).toBe("/roles");

  // 2. Navigate to Departments
  const deptMenuItem = screen.getByRole("menuitem", { name: /departments|組織|部門/i });
  await expect.element(deptMenuItem).toBeVisible();
  await deptMenuItem.click();
  expect(screen.router.state.location.pathname).toBe("/departments");

  // 3. Navigate to User Management
  const userMenuItem = screen.getByRole("menuitem", { name: /users|使用者/i });
  await expect.element(userMenuItem).toBeVisible();
  await userMenuItem.click();
  expect(screen.router.state.location.pathname).toBe("/user");
});
