import {
  Button as RACButton,
  Dialog,
  DialogTrigger,
  Popover,
  type PopoverProps,
} from "react-aria-components";
import { ChevronDown, X } from "lucide-react";
import { useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "../../utils/cn.ts";
import { Tree, type TreeNodeData } from "./tree.tsx";

export interface TreeSelectNode {
  key?: string | number;
  value: string | number;
  title: ReactNode;
  children?: TreeSelectNode[];
  disabled?: boolean;
}

export type TreeSelectValue = string | number | (string | number)[];

export interface TreeSelectProps<T = TreeSelectValue> {
  treeData?: TreeSelectNode[];
  value?: T;
  onChange?: (value: any) => void;
  placeholder?: string;
  allowClear?: boolean;
  treeCheckable?: boolean;
  disabled?: boolean;
  className?: string;
  placement?: PopoverProps["placement"];
  showCheckedStrategy?: string;
  "aria-label"?: string;
}

function findNode(
  nodes: TreeSelectNode[],
  match: (node: TreeSelectNode) => boolean,
): TreeSelectNode | null {
  for (const node of nodes) {
    if (match(node)) {
      return node;
    }
    if (node.children !== undefined) {
      const found = findNode(node.children, match);
      if (found !== null) return found;
    }
  }
  return null;
}

function toTreeNodeData(nodes: TreeSelectNode[]): TreeNodeData[] {
  return nodes.map((n) => {
    const nodeData: TreeNodeData = {
      key: n.key ?? n.value,
      title: n.title,
    };
    if (n.disabled !== undefined) {
      nodeData.disabled = n.disabled;
    }
    if (n.children !== undefined) {
      nodeData.children = toTreeNodeData(n.children);
    }
    return nodeData;
  });
}

const EMPTY_TREE_DATA: TreeSelectNode[] = [];

function TreeSelectComponent<T = TreeSelectValue>({
  treeData = EMPTY_TREE_DATA,
  value,
  onChange,
  placeholder,
  allowClear = false,
  treeCheckable = false,
  disabled = false,
  className,
  placement = "bottom start",
  "aria-label": ariaLabel,
}: TreeSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const convertedTreeData = toTreeNodeData(treeData);

  const hasValue =
    value !== undefined && value !== null && (!Array.isArray(value) || value.length > 0);

  let displayLabel: ReactNode = null;
  if (!hasValue) {
    displayLabel =
      placeholder !== undefined && placeholder !== "" ? (
        <span className="text-muted-foreground">{placeholder}</span>
      ) : null;
  } else if (treeCheckable && Array.isArray(value)) {
    const selectedItems: TreeSelectNode[] = [];
    for (const val of value) {
      const found = findNode(
        treeData,
        (n) => String(n.value) === String(val) || String(n.key) === String(val),
      );
      if (found !== null) {
        selectedItems.push(found);
      }
    }
    if (selectedItems.length === 0) {
      displayLabel = `${String(value.length)} selected`;
    } else {
      displayLabel = (
        <div className="flex flex-wrap items-center gap-1">
          {selectedItems.map((item) => (
            <span
              key={String(item.value)}
              className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
            >
              {item.title}
            </span>
          ))}
        </div>
      );
    }
  } else {
    const singleFound = findNode(
      treeData,
      (n) => String(n.value) === String(value) || String(n.key) === String(value),
    );
    displayLabel = singleFound !== null ? singleFound.title : String(value);
  }

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    if (onChange !== undefined) {
      if (treeCheckable) {
        onChange([]);
      } else {
        onChange(undefined);
      }
    }
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <RACButton
        isDisabled={disabled}
        {...(ariaLabel !== undefined && ariaLabel !== "" ? { "aria-label": ariaLabel } : {})}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors",
          "hover:border-primary/60 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-ring",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <span className="truncate text-left">{displayLabel}</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          {allowClear && hasValue && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="rounded-xs p-0.5 hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </span>
          )}
          <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
        </div>
      </RACButton>

      <Popover
        placement={placement}
        className={({ isEntering, isExiting }) =>
          cn(
            "z-50 min-w-(--trigger-width) max-w-sm rounded-md border border-border bg-background p-1.5 shadow-md outline-hidden",
            isEntering && "animate-in fade-in zoom-in-95 duration-100 ease-out",
            isExiting && "animate-out fade-out zoom-out-95 duration-75 ease-in",
          )
        }
      >
        <Dialog className="outline-hidden max-h-60 overflow-y-auto">
          {treeCheckable ? (
            <Tree
              treeData={convertedTreeData}
              checkable
              checkedKeys={Array.isArray(value) ? value : []}
              onCheck={(keys) => {
                onChange?.(keys);
              }}
              defaultExpandAll
            />
          ) : (
            <Tree
              treeData={convertedTreeData}
              selectionMode="single"
              selectedKeys={value != null ? new Set([String(value)]) : new Set()}
              onNodeAction={(node) => {
                const found = findNode(
                  treeData,
                  (n) => String(n.key ?? n.value) === String(node.key),
                );
                onChange?.(found !== null ? found.value : node.key);
                setIsOpen(false);
              }}
              onSelectionChange={(selection) => {
                if (selection !== "all") {
                  const key = Array.from(selection)[0];
                  if (key !== undefined) {
                    const found = findNode(
                      treeData,
                      (n) => String(n.key ?? n.value) === String(key),
                    );
                    onChange?.(found !== null ? found.value : key);
                  } else {
                    onChange?.(undefined);
                  }
                  setIsOpen(false);
                }
              }}
              defaultExpandAll
            />
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

export const TreeSelect = Object.assign(TreeSelectComponent, {
  SHOW_ALL: "SHOW_ALL",
  SHOW_PARENT: "SHOW_PARENT",
  SHOW_CHILD: "SHOW_CHILD",
});
