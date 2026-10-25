import { createFileRoute, redirect } from "@tanstack/react-router";
import { PermissionButton } from "../components/PermissionGate.tsx";
import { Card } from "../components/ui/card.tsx";
import { UserModal } from "../components/user/UserModal.tsx";
import { UserTable } from "../components/user/UserTable.tsx";
import { useI18n } from "../hooks/useI18n.ts";
import { useUsers } from "../hooks/useUsers.ts";
import { userInfoQueryOptions } from "./__root.tsx";

export const Route = createFileRoute("/user")({
  beforeLoad: async ({ context }) => {
    const data = await context.queryClient.query({
      ...userInfoQueryOptions(),
      staleTime: "static",
    });
    const isSuperAdmin = data.roles.includes("super_admin");
    const hasPerm = isSuperAdmin || data.permissions.includes("system:user:read");
    if (!hasPerm) {
      throw redirect({ to: "/403" });
    }
  },
  component: UsersPage,
});

function UsersPage() {
  const { t } = useI18n();
  const {
    users,
    departments,
    roles,
    isLoading,
    modalOpen,
    selectedUser,
    formKey,
    isSaving,
    openCreateModal,
    openEditModal,
    closeModal,
    saveUser,
    deleteUser,
  } = useUsers();

  return (
    <Card
      title={t("routes./user")}
      extra={
        <div className="flex gap-2">
          <PermissionButton
            variant="default"
            permission="system:user:create"
            onClick={openCreateModal}
          >
            {t("user.create")}
          </PermissionButton>
        </div>
      }
    >
      <UserTable
        data={users}
        departments={departments}
        roles={roles}
        loading={isLoading}
        onEdit={openEditModal}
        onDelete={deleteUser}
      />
      <UserModal
        open={modalOpen}
        user={selectedUser}
        departments={departments}
        roles={roles}
        formKey={formKey}
        confirmLoading={isSaving}
        onCancel={closeModal}
        onSubmit={saveUser}
      />
    </Card>
  );
}
