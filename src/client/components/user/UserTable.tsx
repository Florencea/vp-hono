import { useI18n } from "../../hooks/useI18n.ts";
import type { DepartmentItem, RoleItem, UserItem } from "../../types/api.ts";
import { PermissionButton, PermissionGate } from "../PermissionGate.tsx";
import { Badge } from "../ui/badge.tsx";
import { Button } from "../ui/button.tsx";
import { Popconfirm } from "../ui/popconfirm.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";

export interface UserTableProps {
  data: UserItem[];
  departments: DepartmentItem[];
  roles: RoleItem[];
  loading?: boolean | undefined;
  onEdit: (record: UserItem) => void;
  onDelete: (id: number) => void;
}

export function UserTable({
  data,
  departments,
  roles,
  loading = false,
  onEdit,
  onDelete,
}: UserTableProps) {
  const { t } = useI18n();

  const deptMap = new Map(departments.map((d) => [d.id, d.name]));
  const roleMap = new Map(roles.map((r) => [r.id, r.name]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-40">{t("user.account")}</TableHead>
          <TableHead className="w-30">{t("user.name")}</TableHead>
          <TableHead className="w-30">{t("user.employeeNo")}</TableHead>
          <TableHead className="w-30">{t("user.title")}</TableHead>
          <TableHead className="w-35">{t("user.department")}</TableHead>
          <TableHead>{t("user.roles")}</TableHead>
          <TableHead className="w-25">{t("common.status")}</TableHead>
          <TableHead className="w-35">{t("common.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8}>
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8}>
              <div className="py-8 text-center text-muted-foreground">No data</div>
            </TableCell>
          </TableRow>
        ) : (
          data.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{record.account}</span>
                  {record.isSystem || record.account === "admin" ? (
                    <Badge variant="secondary">System</Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.employeeNo}</TableCell>
              <TableCell>{record.title}</TableCell>
              <TableCell>
                {record.departmentId !== null ? (deptMap.get(record.departmentId) ?? "-") : "-"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-1">
                  {record.roleIds.map((rid) => (
                    <Badge variant="outline" key={rid}>
                      {roleMap.get(rid) ?? rid}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    record.status === "active"
                      ? "default"
                      : record.status === "inactive"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {record.status === "active"
                    ? t("user.statusActive")
                    : record.status === "inactive"
                      ? t("user.statusInactive")
                      : t("user.statusSuspended")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <PermissionButton
                    variant="link"
                    size="sm"
                    permission="system:user:update"
                    onClick={() => onEdit(record)}
                  >
                    {t("common.edit")}
                  </PermissionButton>
                  {!record.isSystem && record.account !== "admin" && (
                    <PermissionGate permission="system:user:delete">
                      <Popconfirm
                        title={t("common.confirmDelete")}
                        onConfirm={() => onDelete(record.id)}
                      >
                        <Button variant="link-destructive" size="sm">
                          {t("common.delete")}
                        </Button>
                      </Popconfirm>
                    </PermissionGate>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
