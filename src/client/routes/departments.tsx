import { createFileRoute, redirect } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { DepartmentModal } from "../components/department/DepartmentModal.tsx";
import { DepartmentTreeTable } from "../components/department/DepartmentTreeTable.tsx";
import { PermissionButton } from "../components/PermissionGate.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("routes./departments")}</CardTitle>
        <div className="flex gap-2">
          <PermissionButton
            variant="default"
            permission="system:dept:create"
            onClick={openCreateModal}
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("dept.create")}
          </PermissionButton>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
