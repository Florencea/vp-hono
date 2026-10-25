import { afterEach, expect, test } from "vite-plus/test";
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

    if (
      url.includes("/api/departments") ||
      url.includes("/api/roles") ||
      url.includes("/api/users")
    ) {
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return originalFetch(input, init);
  };
}

test("403 Forbidden: renders forbidden title and description and navigates back to home on button click", async () => {
  mockAuthEnvironment();

  const screen = await renderAppAt("/403");

  // Verify 403 status title and description are rendered
  const title = screen.getByText(/403 Forbidden|403 禁止訪問|403/i);
  await expect.element(title).toBeVisible();

  const description = screen.getByText(
    /You do not have permission to access this resource|您沒有足夠的權限訪問此資源/i,
  );
  await expect.element(description).toBeVisible();

  // Locate the "Back to Home" button
  const backHomeBtn = screen.getByRole("button", { name: /Back to Home|返回首頁/i });
  await expect.element(backHomeBtn).toBeVisible();

  // Click back to home button and verify navigation to "/"
  await backHomeBtn.click();
  expect(screen.router.state.location.pathname).toBe("/");
});
