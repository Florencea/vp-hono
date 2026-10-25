import { useI18n } from "../../hooks/useI18n.ts";
import type { DepartmentItem, RoleItem, UserItem } from "../../types/api.ts";
import { DataTable, type DataTableColumn } from "../common/DataTable.tsx";
import { PermissionButton, PermissionGate } from "../PermissionGate.tsx";
import { Badge } from "../ui/badge.tsx";
import { Button } from "../ui/button.tsx";
import { Popconfirm } from "../ui/popconfirm.tsx";

export interface UserTableProps {
  data: UserItem[];
  departments: DepartmentItem[];
  roles: RoleItem[];
  loading?: boolean;
  onEdit: (record: UserItem) => void;
  onDelete: (id: number) => void;
}

export function UserTable({ data, departments, roles, loading, onEdit, onDelete }: UserTableProps) {
  const { t } = useI18n();

  const deptMap = new Map(departments.map((d) => [d.id, d.name]));
  const roleMap = new Map(roles.map((r) => [r.id, r.name]));

  const columns: DataTableColumn<UserItem>[] = [
    {
      title: t("user.account"),
      dataIndex: "account",
      key: "account",
      width: 160,
      render: (account: string, record) => (
        <div className="flex items-center gap-2">
          <span>{account}</span>
          {record.isSystem || record.account === "admin" ? (
            <Badge variant="secondary">System</Badge>
          ) : null}
        </div>
      ),
    },
    {
      title: t("user.name"),
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: t("user.employeeNo"),
      dataIndex: "employeeNo",
      key: "employeeNo",
      width: 120,
    },
    {
      title: t("user.title"),
      dataIndex: "title",
      key: "title",
      width: 120,
    },
    {
      title: t("user.department"),
      dataIndex: "departmentId",
      key: "departmentId",
      width: 140,
      render: (deptId: number | null) => (deptId !== null ? (deptMap.get(deptId) ?? "-") : "-"),
    },
    {
      title: t("user.roles"),
      dataIndex: "roleIds",
      key: "roleIds",
      render: (roleIds: number[]) => (
        <div className="flex flex-wrap items-center gap-1">
          {roleIds.map((rid) => (
            <Badge variant="outline" key={rid}>
              {roleMap.get(rid) ?? rid}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      title: t("common.status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: UserItem["status"]) => (
        <Badge
          variant={
            status === "active" ? "default" : status === "inactive" ? "secondary" : "destructive"
          }
        >
          {status === "active"
            ? t("user.statusActive")
            : status === "inactive"
              ? t("user.statusInactive")
              : t("user.statusSuspended")}
        </Badge>
      ),
    },
    {
      title: t("common.actions"),
      key: "actions",
      width: 140,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <PermissionButton
            type="link"
            size="small"
            permission="system:user:update"
            onClick={() => {
              onEdit(record);
            }}
          >
            {t("common.edit")}
          </PermissionButton>
          {!record.isSystem && record.account !== "admin" && (
            <PermissionGate permission="system:user:delete">
              <Popconfirm
                title={t("common.confirmDelete")}
                onConfirm={() => {
                  onDelete(record.id);
                }}
              >
                <Button type="link" danger size="small">
                  {t("common.delete")}
                </Button>
              </Popconfirm>
            </PermissionGate>
          )}
        </div>
      ),
    },
  ];

  return <DataTable<UserItem> columns={columns} dataSource={data} loading={loading === true} />;
}
