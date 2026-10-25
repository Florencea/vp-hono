import { createFileRoute, redirect } from "@tanstack/react-router";
import { PermissionButton } from "../components/PermissionGate.tsx";
import { RoleDrawer } from "../components/role/RoleDrawer.tsx";
import { RoleTable } from "../components/role/RoleTable.tsx";
import { Card } from "../components/ui/card.tsx";
import { useI18n } from "../hooks/useI18n.ts";
import { useRoles } from "../hooks/useRoles.ts";
import { userInfoQueryOptions } from "./__root.tsx";

export const Route = createFileRoute("/roles")({
  beforeLoad: async ({ context }) => {
    const data = await context.queryClient.query({
      ...userInfoQueryOptions(),
      staleTime: "static",
    });
    const isSuperAdmin = data.roles.includes("super_admin");
    const hasPerm = isSuperAdmin || data.permissions.includes("system:role:read");
    if (!hasPerm) {
      throw redirect({ to: "/403" });
    }
  },
  component: RolesPage,
});

function RolesPage() {
  const { t } = useI18n();
  const {
    roles,
    permissions,
    departments,
    isLoading,
    drawerOpen,
    selectedRole,
    formKey,
    isSaving,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    saveRole,
    deleteRole,
  } = useRoles();

  return (
    <Card
      title={t("routes./roles")}
      extra={
        <div className="flex gap-2">
          <PermissionButton
            variant="default"
            permission="system:role:create"
            onClick={openCreateDrawer}
          >
            {t("role.create")}
          </PermissionButton>
        </div>
      }
    >
      <RoleTable data={roles} loading={isLoading} onEdit={openEditDrawer} onDelete={deleteRole} />

      <RoleDrawer
        open={drawerOpen}
        role={selectedRole}
        permissions={permissions}
        departments={departments}
        formKey={formKey}
        confirmLoading={isSaving}
        onClose={closeDrawer}
        onSubmit={saveRole}
      />
    </Card>
  );
}
