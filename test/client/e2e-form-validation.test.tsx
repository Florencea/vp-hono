import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { renderAppAt } from "./test-utils";

const originalFetch = window.fetch.bind(window);

const unhandledRejectionHandler = (e: PromiseRejectionEvent) => {
  // Prevent unhandled rejections from Antd's validateFields() rejection
  e.preventDefault();
};

function preventUnhandledValidationRejection() {
  window.addEventListener("unhandledrejection", unhandledRejectionHandler);
  return () => window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
}

let cleanupRejection: () => void;

beforeEach(() => {
  cleanupRejection = preventUnhandledValidationRejection();
});

afterEach(() => {
  cleanupRejection();
  window.fetch = originalFetch;
  vi.restoreAllMocks();
});

function mockBaseEnvironment() {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (url.includes("/api/auth/getUserInfo")) {
      return new Response(
        JSON.stringify({
          success: true,
          id: 1,
          account: "admin",
          name: "Administrator",
          employeeNo: "ADM001",
          title: "Super Admin",
          departmentId: 1,
          roles: ["super_admin"],
          permissions: [
            "system:user:read",
            "system:user:create",
            "system:role:read",
            "system:role:create",
            "system:dept:read",
            "system:dept:create",
          ],
          dataScopes: ["ALL"],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (url.includes("/api/users")) {
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

    if (url.includes("/api/departments")) {
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes("/api/permissions")) {
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return originalFetch(input, init);
  };
}

test("Form Validation: UserModal blocks submission with empty required fields and renders accessible errors", async () => {
  mockBaseEnvironment();
  const fetchSpy = vi.spyOn(window, "fetch");

  const screen = await renderAppAt("/user");

  // Open User create modal
  const createBtn = screen.getByRole("button", { name: /create|新增/i });
  await expect.element(createBtn).toBeVisible();
  await createBtn.click();

  // Find modal dialog
  const dialog = screen.getByRole("dialog");
  await expect.element(dialog).toBeVisible();

  // Click OK without filling required fields
  const okBtn = dialog.getByRole("button", { name: /ok|確認|確定/i });
  await okBtn.click();

  // Verify client validation message appears in DOM for account and password
  const accountError = screen.getByText(/please enter account|請輸入帳號/i);
  await expect.element(accountError).toBeVisible();

  const passwordError = screen.getByText(/please enter password|請輸入密碼/i);
  await expect.element(passwordError).toBeVisible();

  // Verify network call was prevented
  const postCalls = fetchSpy.mock.calls.filter(([callInput, init]) => {
    const url =
      typeof callInput === "string"
        ? callInput
        : callInput instanceof URL
          ? callInput.toString()
          : callInput.url;
    return url.includes("/api/users") && init?.method === "POST";
  });
  expect(postCalls).toHaveLength(0);
});

test("Form Validation: RoleDrawer blocks submission with empty required fields and renders accessible errors", async () => {
  mockBaseEnvironment();
  const fetchSpy = vi.spyOn(window, "fetch");

  const screen = await renderAppAt("/roles");

  // Open Role create drawer
  const createBtn = screen.getByRole("button", { name: /create|新增/i });
  await expect.element(createBtn).toBeVisible();
  await createBtn.click();

  // Find drawer dialog
  const drawer = screen.getByRole("dialog");
  await expect.element(drawer).toBeVisible();

  // Click save without entering role code or name
  const saveBtn = drawer.getByRole("button", { name: /save|儲存/i });
  await saveBtn.click();

  // Verify validation feedback is visible for role code
  const codeError = screen.getByText(/please enter role code|請輸入角色代碼/i);
  await expect.element(codeError).toBeVisible();

  // Verify no POST request was sent to /api/roles
  const postCalls = fetchSpy.mock.calls.filter(([callInput, init]) => {
    const url =
      typeof callInput === "string"
        ? callInput
        : callInput instanceof URL
          ? callInput.toString()
          : callInput.url;
    return url.includes("/api/roles") && init?.method === "POST";
  });
  expect(postCalls).toHaveLength(0);
});

test("Form Validation: DepartmentModal blocks submission with empty required fields and renders accessible errors", async () => {
  mockBaseEnvironment();
  const fetchSpy = vi.spyOn(window, "fetch");

  const screen = await renderAppAt("/departments");

  // Open Department create modal
  const createBtn = screen.getByRole("button", { name: /create|新增/i });
  await expect.element(createBtn).toBeVisible();
  await createBtn.click();

  // Find modal dialog
  const dialog = screen.getByRole("dialog");
  await expect.element(dialog).toBeVisible();

  // Click OK without filling department name
  const okBtn = dialog.getByRole("button", { name: /ok|確認|確定/i });
  await okBtn.click();

  // Verify validation message is rendered
  const errorMsg = screen.getByText(/please enter|請輸入/i);
  await expect.element(errorMsg).toBeVisible();

  // Verify no POST request was sent to /api/departments
  const postCalls = fetchSpy.mock.calls.filter(([callInput, init]) => {
    const url =
      typeof callInput === "string"
        ? callInput
        : callInput instanceof URL
          ? callInput.toString()
          : callInput.url;
    return url.includes("/api/departments") && init?.method === "POST";
  });
  expect(postCalls).toHaveLength(0);
});
