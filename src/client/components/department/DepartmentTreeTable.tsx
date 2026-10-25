import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import type { DepartmentItem } from "../../types/api.ts";
import { PermissionButton, PermissionGate } from "../PermissionGate.tsx";
import { Button } from "../ui/button.tsx";
import { Popconfirm } from "../ui/popconfirm.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";
import { cn } from "../../utils/cn.ts";

export interface DepartmentNode extends DepartmentItem {
  key: string;
  children?: DepartmentNode[];
}

export interface DepartmentTreeTableProps {
  data: DepartmentNode[];
  loading?: boolean | undefined;
  onAddChild: (parent: DepartmentItem) => void;
  onEdit: (record: DepartmentItem) => void;
  onDelete: (id: number) => void;
}

export function DepartmentTreeTable({
  data,
  loading = false,
  onAddChild,
  onEdit,
  onDelete,
}: DepartmentTreeTableProps) {
  const { t } = useI18n();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    const ids = new Set<number>();
    const collectIds = (nodes: DepartmentNode[]) => {
      for (const node of nodes) {
        ids.add(node.id);
        if (node.children !== undefined && node.children.length > 0) {
          collectIds(node.children);
        }
      }
    };
    collectIds(data);
    return ids;
  });

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderRows = (nodes: DepartmentNode[], depth = 0): React.JSX.Element[] => {
    return nodes.flatMap((node) => {
      const hasChildren = node.children !== undefined && node.children.length > 0;
      const isExpanded = expandedIds.has(node.id);
      const indentClass = depth === 0 ? "" : depth === 1 ? "pl-6" : depth === 2 ? "pl-12" : "pl-18";

      const currentRow = (
        <TableRow key={node.id}>
          <TableCell>
            <div className={cn("flex items-center gap-1.5", indentClass)}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleExpand(node.id)}
                  className="flex size-6 shrink-0 items-center justify-center rounded hover:bg-muted cursor-pointer transition-colors"
                  aria-label={isExpanded ? "Collapse row" : "Expand row"}
                >
                  <ChevronRight
                    className={cn(
                      "size-4 transition-transform duration-150",
                      isExpanded && "rotate-90",
                    )}
                  />
                </button>
              ) : (
                <span className="size-6 shrink-0" />
              )}
              <span className="font-medium">{node.name}</span>
            </div>
          </TableCell>
          <TableCell>{node.sort}</TableCell>
          <TableCell>
            <span className="text-muted-foreground">{node.path}</span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <PermissionButton
                variant="link"
                size="sm"
                permission="system:dept:create"
                onClick={() => onAddChild(node)}
              >
                {t("common.add")}
              </PermissionButton>
              <PermissionButton
                variant="link"
                size="sm"
                permission="system:dept:update"
                onClick={() => onEdit(node)}
              >
                {t("common.edit")}
              </PermissionButton>
              <PermissionGate permission="system:dept:delete">
                <Popconfirm title={t("common.confirmDelete")} onConfirm={() => onDelete(node.id)}>
                  <Button variant="link-destructive" size="sm">
                    {t("common.delete")}
                  </Button>
                </Popconfirm>
              </PermissionGate>
            </div>
          </TableCell>
        </TableRow>
      );

      if (hasChildren && isExpanded && node.children !== undefined) {
        return [currentRow, ...renderRows(node.children, depth + 1)];
      }

      return [currentRow];
    });
  };

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-75">{t("dept.name")}</TableHead>
            <TableHead className="w-25">{t("dept.sort")}</TableHead>
            <TableHead className="w-45">Path</TableHead>
            <TableHead className="w-50">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="py-8 text-center text-muted-foreground">Loading...</div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="py-8 text-center text-muted-foreground">No data</div>
              </TableCell>
            </TableRow>
          ) : (
            renderRows(data)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
