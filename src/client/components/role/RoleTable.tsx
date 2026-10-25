import { useI18n } from "../../hooks/useI18n.ts";
import type { RoleItem } from "../../types/api.ts";
import { DataTable, type DataTableColumn } from "../common/DataTable.tsx";
import { PermissionButton, PermissionGate } from "../PermissionGate.tsx";
import { Badge } from "../ui/badge.tsx";
import { Button } from "../ui/button.tsx";
import { Popconfirm } from "../ui/popconfirm.tsx";

export interface RoleTableProps {
  data: RoleItem[];
  loading?: boolean;
  onEdit: (record: RoleItem) => void;
  onDelete: (id: number) => void;
}

export function RoleTable({ data, loading, onEdit, onDelete }: RoleTableProps) {
  const { t } = useI18n();

  const columns: DataTableColumn<RoleItem>[] = [
    {
      title: t("role.code"),
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (text: string, record) => (
        <div className="flex items-center gap-2">
          <span>{text}</span>
          {record.isSystem ? <Badge variant="secondary">System</Badge> : null}
        </div>
      ),
    },
    {
      title: t("role.name"),
      dataIndex: "name",
      key: "name",
      width: 180,
    },
    {
      title: t("role.dataScope"),
      dataIndex: "dataScope",
      key: "dataScope",
      width: 180,
      render: (scope: RoleItem["dataScope"]) => (
        <Badge variant="outline">{t(`role.scopes.${scope}`)}</Badge>
      ),
    },
    {
      title: t("dept.sort"),
      dataIndex: "sort",
      key: "sort",
      width: 80,
    },
    {
      title: t("role.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("common.actions"),
      key: "actions",
      width: 160,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <PermissionButton
            type="link"
            size="small"
            permission="system:role:update"
            onClick={() => {
              onEdit(record);
            }}
          >
            {t("common.edit")}
          </PermissionButton>
          {!record.isSystem && (
            <PermissionGate permission="system:role:delete">
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

  return <DataTable<RoleItem> columns={columns} dataSource={data} loading={loading === true} />;
}
