import { useI18n } from "../../hooks/useI18n.ts";
import type { DepartmentItem } from "../../types/api.ts";
import { DataTable, type DataTableColumn } from "../common/DataTable.tsx";
import { PermissionButton, PermissionGate } from "../PermissionGate.tsx";
import { Button } from "../ui/button.tsx";
import { Popconfirm } from "../ui/popconfirm.tsx";

export interface DepartmentNode extends DepartmentItem {
  key: string;
  children?: DepartmentNode[];
}

export interface DepartmentTreeTableProps {
  data: DepartmentNode[];
  loading?: boolean;
  onAddChild: (parent: DepartmentItem) => void;
  onEdit: (record: DepartmentItem) => void;
  onDelete: (id: number) => void;
}

export function DepartmentTreeTable({
  data,
  loading,
  onAddChild,
  onEdit,
  onDelete,
}: DepartmentTreeTableProps) {
  const { t } = useI18n();

  const columns: DataTableColumn<DepartmentNode>[] = [
    {
      title: t("dept.name"),
      dataIndex: "name",
      key: "name",
      width: 280,
    },
    {
      title: t("dept.sort"),
      dataIndex: "sort",
      key: "sort",
      width: 100,
    },
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
      width: 160,
    },
    {
      title: t("common.actions"),
      key: "actions",
      width: 220,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <PermissionButton
            type="link"
            size="small"
            permission="system:dept:create"
            onClick={() => {
              onAddChild(record);
            }}
          >
            {t("common.add")}
          </PermissionButton>
          <PermissionButton
            type="link"
            size="small"
            permission="system:dept:update"
            onClick={() => {
              onEdit(record);
            }}
          >
            {t("common.edit")}
          </PermissionButton>
          <PermissionGate permission="system:dept:delete">
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
        </div>
      ),
    },
  ];

  return (
    <DataTable<DepartmentNode> columns={columns} dataSource={data} loading={loading === true} />
  );
}
