import { Pencil, Trash2 } from "lucide-react";
import { useI18n } from "../../hooks/useI18n.ts";
import type { RoleItem } from "../../types/api.ts";
import { PermissionButton, PermissionGate } from "../PermissionGate.tsx";
import { Badge } from "../ui/badge.tsx";
import { Button } from "../ui/button.tsx";
import { Popconfirm } from "../ui/popconfirm.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";

export interface RoleTableProps {
  data: RoleItem[];
  loading?: boolean | undefined;
  onEdit: (record: RoleItem) => void;
  onDelete: (id: number) => void;
}

export function RoleTable({ data, loading = false, onEdit, onDelete }: RoleTableProps) {
  const { t } = useI18n();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-45">{t("role.code")}</TableHead>
          <TableHead className="w-45">{t("role.name")}</TableHead>
          <TableHead className="w-40">{t("role.dataScope")}</TableHead>
          <TableHead className="w-20">{t("dept.sort")}</TableHead>
          <TableHead>{t("role.description")}</TableHead>
          <TableHead className="w-40">{t("common.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6}>
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6}>
              <div className="py-8 text-center text-muted-foreground">No data</div>
            </TableCell>
          </TableRow>
        ) : (
          data.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{record.code}</span>
                  {record.isSystem ? <Badge variant="secondary">System</Badge> : null}
                </div>
              </TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{t(`role.scopes.${record.dataScope}`)}</Badge>
              </TableCell>
              <TableCell>{record.sort}</TableCell>
              <TableCell>
                <span className="text-muted-foreground">{record.description ?? "-"}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <PermissionButton
                    variant="ghost"
                    size="sm"
                    permission="system:role:update"
                    onClick={() => onEdit(record)}
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    {t("common.edit")}
                  </PermissionButton>
                  {!record.isSystem && (
                    <PermissionGate permission="system:role:delete">
                      <Popconfirm
                        title={t("common.confirmDelete")}
                        onConfirm={() => onDelete(record.id)}
                      >
                        <Button variant="ghost-destructive" size="sm">
                          <Trash2 className="size-3.5" aria-hidden="true" />
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
