import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { renderAppAt } from "./test-utils";

const originalFetch = window.fetch.bind(window);

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  window.fetch = originalFetch;
  localStorage.clear();
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

test("i18n dynamic switching: toggles between zh-TW and en-US without full page reload", async () => {
  mockAuthEnvironment();
  localStorage.setItem("app_lang", "zh-TW");

  const screen = await renderAppAt("/");

  // Initial language is zh-TW: verify logout button text is "登出"
  const logoutBtnZh = screen.getByRole("button", { name: "登出" });
  await expect.element(logoutBtnZh).toBeVisible();

  // Find language switcher button (has title attribute and/or global icon)
  const langSwitcher = screen.getByRole("button", { name: /global|切換語言|change language/i });
  await expect.element(langSwitcher).toBeVisible();
  await langSwitcher.click();

  // Select "English" from dropdown menu
  const englishOption = screen.getByRole("menuitem", { name: "English" });
  await expect.element(englishOption).toBeVisible();
  await englishOption.click();

  // Verify UI label dynamically updates to English without reload
  const logoutBtnEn = screen.getByRole("button", { name: "Logout" });
  await expect.element(logoutBtnEn).toBeVisible();
  expect(localStorage.getItem("app_lang")).toBe("en-US");

  // Switch back to "繁體中文"
  const langSwitcherEn = screen.getByRole("button", { name: /global|change language|切換語言/i });
  await langSwitcherEn.click();

  const zhOption = screen.getByRole("menuitem", { name: "繁體中文" });
  await expect.element(zhOption).toBeVisible();
  await zhOption.click();

  // Verify UI label reverts to Traditional Chinese
  await expect.element(screen.getByRole("button", { name: "登出" })).toBeVisible();
  expect(localStorage.getItem("app_lang")).toBe("zh-TW");
});
