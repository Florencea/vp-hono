import {
  Table as RACTable,
  TableHeader as RACTableHeader,
  Column as RACColumn,
  TableBody as RACTableBody,
  Row as RACRow,
  Cell as RACCell,
} from "react-aria-components";
import {
  createTableHook,
  tableFeatures,
  columnVisibilityFeature,
  rowExpandingFeature,
  createExpandedRowModel,
  rowSortingFeature,
  createSortedRowModel,
  rowPaginationFeature,
  createPaginatedRowModel,
  rowSelectionFeature,
  type TableOptions,
} from "@tanstack/react-table";
import { ChevronRight, Loader2 } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../utils/cn.ts";

export interface DataTableColumn<T> {
  key?: string;
  id?: string;
  title?: ReactNode;
  header?: ReactNode | ((info: unknown) => ReactNode);
  dataIndex?: keyof T | string | (string | number)[];
  accessorKey?: string;
  render?: (value: any, record: T, index: number) => ReactNode;
  cell?: (info: unknown) => ReactNode;
  width?: number | string;
  className?: string;
  align?: "left" | "center" | "right";
  isRowHeader?: boolean;
}

export interface DataTableProps<T extends object = object> {
  columns?: DataTableColumn<T>[];
  data?: T[];
  dataSource?: T[];
  loading?: boolean;
  rowKey?: (keyof T & string) | "id" | "key" | ((record: T) => string | number);
  getSubRows?: (row: T) => T[] | undefined;
  expandable?: {
    defaultExpandAllRows?: boolean;
    expandedRowKeys?: (string | number)[];
    onExpandedRowsChange?: (expandedKeys: (string | number)[]) => void;
  };
  scroll?: { x?: string | number; y?: string | number };
  size?: "small" | "middle" | "large";
  pagination?: boolean;
  emptyText?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const features = tableFeatures({
  columnVisibilityFeature,
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
});

const { createAppColumnHelper, useAppTable } = createTableHook({
  features,
});

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

function hasSubRows<T extends object>(row: T): row is T & { children: T[] } {
  if (!isRecord(row)) return false;
  const children = row["children"];
  return Array.isArray(children);
}

function toPrimitiveString(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean" || typeof val === "bigint") {
    return String(val);
  }
  return "";
}

function extractSubRows<T extends object>(row: T): T[] | undefined {
  if (hasSubRows(row) && row.children.length > 0) {
    return row.children;
  }
  return undefined;
}

function extractRowId<T extends object>(
  row: T,
  index: number,
  rowKey?: (keyof T & string) | "id" | "key" | ((record: T) => string | number),
): string {
  if (typeof rowKey === "function") {
    return toPrimitiveString(rowKey(row));
  }
  const record: Record<string, unknown> = isRecord(row) ? row : {};
  if (rowKey && rowKey in record) {
    const val = record[rowKey];
    if (val != null) return toPrimitiveString(val);
  }
  if ("id" in record) {
    const val = record.id;
    if (val != null) return toPrimitiveString(val);
  }
  if ("key" in record) {
    const val = record.key;
    if (val != null) return toPrimitiveString(val);
  }
  return String(index);
}

function extractDataIndexValue<T extends object>(
  original: T,
  dataIndex: keyof T | string | (string | number)[],
): unknown {
  if (!isRecord(original)) return undefined;

  if (typeof dataIndex === "string" || typeof dataIndex === "number") {
    const key = String(dataIndex);
    return original[key];
  }

  if (Array.isArray(dataIndex)) {
    let current: unknown = original;
    for (const segment of dataIndex) {
      if (isRecord(current)) {
        current = current[String(segment)];
      } else {
        return undefined;
      }
    }
    return current;
  }

  return undefined;
}

function buildTanstackColumns<T extends object>(columns: DataTableColumn<T>[]) {
  const helper = createAppColumnHelper<T>();
  return columns.map((col, colIndex) => {
    const colId = String(
      col.id ??
        col.key ??
        (Array.isArray(col.dataIndex) ? col.dataIndex.join(".") : col.dataIndex) ??
        `col_${colIndex}`,
    );

    return helper.display({
      id: colId,
      header: () => col.title ?? (typeof col.header === "function" ? col.header(null) : col.header),
      cell: (info) => {
        const isFirstColumn = colIndex === 0;
        const canExpand = info.row.getCanExpand();
        const isExpanded = info.row.getIsExpanded();
        const depth = info.row.depth;

        const rawVal = col.dataIndex
          ? extractDataIndexValue(info.row.original, col.dataIndex)
          : undefined;

        let renderedContent: ReactNode;
        if (col.cell) {
          renderedContent = typeof col.cell === "function" ? col.cell(info) : col.cell;
        } else if (col.render) {
          renderedContent = col.render(rawVal, info.row.original, info.row.index);
        } else {
          renderedContent = rawVal != null ? toPrimitiveString(rawVal) : null;
        }

        if (isFirstColumn && (canExpand || depth > 0)) {
          return (
            <div
              className={cn(
                "flex items-center gap-1.5",
                depth === 1 && "pl-6",
                depth === 2 && "pl-12",
                depth >= 3 && "pl-18",
              )}
            >
              {canExpand ? (
                <button
                  type="button"
                  aria-label={isExpanded ? "Collapse row" : "Expand row"}
                  onClick={(e) => {
                    e.stopPropagation();
                    info.row.toggleExpanded();
                  }}
                  className="flex size-5 shrink-0 items-center justify-center rounded-xs text-muted-foreground transition-transform hover:bg-muted hover:text-foreground focus-visible:outline-hidden"
                >
                  <ChevronRight
                    className={cn(
                      "size-4 transition-transform duration-150",
                      isExpanded && "rotate-90",
                    )}
                  />
                </button>
              ) : (
                <span className="size-5 shrink-0" />
              )}
              <span className="truncate">{renderedContent}</span>
            </div>
          );
        }

        return renderedContent;
      },
    });
  });
}

interface WidthCustomStyle extends CSSProperties {
  "--col-w"?: string;
}

export function DataTable<T extends object = object>({
  columns,
  data,
  dataSource,
  loading = false,
  rowKey = "id",
  getSubRows,
  expandable,
  size = "middle",
  emptyText,
  className,
  ariaLabel,
}: DataTableProps<T>) {
  const resolvedColumns = columns ?? [];
  const tableData = data ?? dataSource ?? [];
  const tanstackColumns = buildTanstackColumns(resolvedColumns);
  const resolvedGetSubRows = getSubRows ?? extractSubRows;
  const getRowId = (row: T, index: number) => extractRowId(row, index, rowKey);

  const appTableOptions: Omit<
    TableOptions<typeof features, T>,
    "features"
  > = expandable?.defaultExpandAllRows === true
    ? {
        columns: tanstackColumns,
        data: tableData,
        getRowId,
        getSubRows: resolvedGetSubRows,
        initialState: { expanded: true },
      }
    : {
        columns: tanstackColumns,
        data: tableData,
        getRowId,
        getSubRows: resolvedGetSubRows,
      };

  const table = useAppTable(appTableOptions);

  const cellPadding =
    size === "small" ? "px-3 py-1.5" : size === "large" ? "px-5 py-3.5" : "px-4 py-2.5";

  return (
    <div
      className={cn(
        "relative w-full overflow-auto rounded-md border border-border bg-background",
        className,
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-xs">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}
      <div className="w-full min-w-max">
        <RACTable
          aria-label={ariaLabel ?? "Data Table"}
          className="w-full border-collapse caption-bottom text-sm"
        >
          <RACTableHeader className="border-b border-border bg-muted/40">
            {table.getHeaderGroups().flatMap((headerGroup) =>
              headerGroup.headers.map((header, hIdx) => {
                const colDef = resolvedColumns[hIdx];
                const widthStyle: WidthCustomStyle | undefined = colDef?.width
                  ? {
                      "--col-w":
                        typeof colDef.width === "number" ? `${colDef.width}px` : colDef.width,
                    }
                  : undefined;

                return (
                  <RACColumn
                    key={header.id}
                    id={header.id}
                    isRowHeader={colDef?.isRowHeader ?? hIdx === 0}
                    {...(widthStyle !== undefined ? { style: widthStyle } : {})}
                    className={cn(
                      "h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground outline-hidden whitespace-nowrap",
                      colDef?.width !== undefined && "w-(--col-w)",
                      colDef?.align === "center" && "text-center",
                      colDef?.align === "right" && "text-right",
                      colDef?.className,
                    )}
                  >
                    <table.FlexRender header={header} />
                  </RACColumn>
                );
              }),
            )}
          </RACTableHeader>
          <RACTableBody
            className="divide-y divide-border"
            renderEmptyState={() => (
              <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
                <span>{emptyText ?? "No data"}</span>
              </div>
            )}
          >
            {table.getRowModel().rows.map((row) => (
              <RACRow
                key={row.id}
                id={row.id}
                className="outline-hidden transition-colors hover:bg-muted/40 data-selected:bg-muted"
              >
                {row.getAllCells().map((cell, cIdx) => {
                  const colDef = resolvedColumns[cIdx];
                  return (
                    <RACCell
                      key={cell.id}
                      id={cell.id}
                      className={cn(
                        "align-middle text-sm text-foreground outline-hidden whitespace-nowrap",
                        cellPadding,
                        colDef?.align === "center" && "text-center",
                        colDef?.align === "right" && "text-right",
                        colDef?.className,
                      )}
                    >
                      <table.FlexRender cell={cell} />
                    </RACCell>
                  );
                })}
              </RACRow>
            ))}
          </RACTableBody>
        </RACTable>
      </div>
    </div>
  );
}
