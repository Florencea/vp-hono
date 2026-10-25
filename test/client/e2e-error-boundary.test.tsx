import { afterEach, expect, test } from "vite-plus/test";
import { renderAppAt } from "./test-utils";

const originalFetch = window.fetch.bind(window);

afterEach(() => {
  window.fetch = originalFetch;
});

function mockAuthEnvironment(options?: {
  roles?: {
    id: number;
    code: string;
    name: string;
    description: string | null;
    dataScope: "ALL" | "DEPT" | "SELF";
    sort: number;
    isSystem: boolean;
  }[];
  departments?: {
    id: number;
    name: string;
    parentId: number | null;
    path: string;
    sort: number;
    leaderId: number | null;
  }[];
}) {
  const departments = options?.departments ?? [
    {
      id: 1,
      name: "Engineering Division",
      parentId: null,
      path: ",1,",
      sort: 1,
      leaderId: null,
    },
  ];

  const roles = options?.roles ?? [
    {
      id: 1,
      code: "dev_lead",
      name: "Team Lead",
      description: "Leadership role",
      dataScope: "ALL" as const,
      sort: 1,
      isSystem: false,
    },
  ];

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
          permissions: [
            "system:user:read",
            "system:role:read",
            "system:role:create",
            "system:role:delete",
            "system:dept:read",
            "system:dept:delete",
          ],
          dataScopes: ["ALL"],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (url.includes("/api/departments")) {
      if (init?.method === "DELETE") {
        return new Response(
          JSON.stringify({ error: "Cannot delete department: dependencies exist" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ items: departments }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes("/api/roles")) {
      if (init?.method === "POST") {
        return new Response(
          JSON.stringify({ error: "Database transaction error: duplicate role" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ items: roles }), {
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

    if (url.includes("/api/users")) {
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return originalFetch(input, init);
  };
}

test("API Error Handling: mutation failure on delete intercepts error and displays feedback toast", async () => {
  mockAuthEnvironment();

  const screen = await renderAppAt("/departments");

  // Locate the delete button for Engineering Division in the table
  const deleteBtn = screen.getByRole("button", { name: /delete|刪除/i });
  await expect.element(deleteBtn).toBeVisible();
  await deleteBtn.click();

  // Confirm in Popconfirm dialog
  const confirmBtn = screen.getByRole("button", { name: /confirm|ok|確定|確認/i });
  await expect.element(confirmBtn).toBeVisible();
  await confirmBtn.click();

  // Notification overlay should display the intercepted API error message
  const errorNotification = screen.getByText("Cannot delete department: dependencies exist");
  await expect.element(errorNotification).toBeInTheDocument();
  await expect.element(errorNotification).toBeVisible();
});

test("API Error Handling: server 500 on create mutation triggers global notification", async () => {
  mockAuthEnvironment();

  const screen = await renderAppAt("/roles");

  // Open Create Role drawer
  const createBtn = screen.getByRole("button", { name: /create|新增/i });
  await expect.element(createBtn).toBeVisible();
  await createBtn.click();

  const drawer = screen.getByRole("dialog");
  await expect.element(drawer).toBeVisible();

  // Fill in required fields
  const codeInput = screen.getByRole("textbox", { name: /code|標識|代碼/i });
  const nameInput = screen.getByRole("textbox", { name: /name|名稱/i });

  await codeInput.fill("custom_code");
  await nameInput.fill("Custom Role");

  // Submit drawer form
  const saveBtn = drawer.getByRole("button", { name: /save|儲存/i });
  await saveBtn.click();

  // Verify server 500 error is caught and presented to user via notification
  const errorNotification = screen.getByText("Database transaction error: duplicate role");
  await expect.element(errorNotification).toBeInTheDocument();
  await expect.element(errorNotification).toBeVisible();
});
