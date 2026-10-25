import { createFileRoute, redirect } from "@tanstack/react-router";
import { DepartmentModal } from "../components/department/DepartmentModal.tsx";
import { DepartmentTreeTable } from "../components/department/DepartmentTreeTable.tsx";
import { PermissionButton } from "../components/PermissionGate.tsx";
import { Card } from "../components/ui/card.tsx";
import { useDepartments } from "../hooks/useDepartments.ts";
import { useI18n } from "../hooks/useI18n.ts";
import { userInfoQueryOptions } from "./__root.tsx";

export const Route = createFileRoute("/departments")({
  beforeLoad: async ({ context }) => {
    const data = await context.queryClient.query({
      ...userInfoQueryOptions(),
      staleTime: "static",
    });
    const isSuperAdmin = data.roles.includes("super_admin");
    const hasPerm = isSuperAdmin || data.permissions.includes("system:dept:read");
    if (!hasPerm) {
      throw redirect({ to: "/403" });
    }
  },
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const { t } = useI18n();
  const {
    departments,
    treeData,
    isLoading,
    modalOpen,
    selectedDept,
    parentPresetId,
    formKey,
    isSaving,
    openCreateModal,
    openAddChildModal,
    openEditModal,
    closeModal,
    saveDepartment,
    deleteDepartment,
  } = useDepartments();

  return (
    <Card
      title={t("routes./departments")}
      extra={
        <div className="flex gap-2">
          <PermissionButton
            variant="default"
            permission="system:dept:create"
            onClick={openCreateModal}
          >
            {t("dept.create")}
          </PermissionButton>
        </div>
      }
    >
      <DepartmentTreeTable
        data={treeData}
        loading={isLoading}
        onAddChild={openAddChildModal}
        onEdit={openEditModal}
        onDelete={deleteDepartment}
      />
      <DepartmentModal
        open={modalOpen}
        department={selectedDept}
        parentPresetId={parentPresetId}
        departments={departments}
        formKey={formKey}
        confirmLoading={isSaving}
        onCancel={closeModal}
        onSubmit={saveDepartment}
      />
    </Card>
  );
}
