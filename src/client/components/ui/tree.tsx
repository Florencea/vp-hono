import {
  Button as RACButton,
  composeRenderProps,
  Tree as RACTree,
  TreeItem as RACTreeItem,
  TreeItemContent as RACTreeItemContent,
  type TreeItemContentRenderProps,
  type TreeItemProps as RACTreeItemProps,
  type TreeProps as RACTreeProps,
  type Key,
  type Selection,
} from "react-aria-components";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn.ts";
import { Checkbox } from "./checkbox.tsx";

export {
  TreeSection,
  type SectionProps as TreeSectionProps,
  TreeHeader,
  type HeaderProps as TreeHeaderProps,
} from "react-aria-components";

export interface TreeNodeData {
  key: string | number;
  title: ReactNode;
  children?: TreeNodeData[];
  disabled?: boolean;
}

export interface TreeItemProps<T extends object = object> extends Omit<
  RACTreeItemProps<T>,
  "children"
> {
  title?: ReactNode;
  children?: ReactNode;
}

export interface TreeItemContentProps {
  children?: ReactNode | ((values: TreeItemContentRenderProps) => ReactNode);
  className?: string;
}

export function TreeItemContent({ children, className }: TreeItemContentProps) {
  return (
    <RACTreeItemContent>
      {(renderProps) => {
        const { selectionBehavior, selectionMode, hasChildItems, isExpanded } = renderProps;
        return (
          <div
            className={cn(
              "flex w-full items-center gap-1.5 rounded-sm px-1.5 py-1 text-sm text-foreground transition-colors",
              "hover:bg-muted/60 focus:bg-muted/80 focus:outline-hidden",
              className,
            )}
          >
            {hasChildItems ? (
              <RACButton
                slot="chevron"
                className="flex size-5 shrink-0 items-center justify-center rounded-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-hidden"
              >
                <ChevronRight
                  className={cn(
                    "size-3.5 transition-transform duration-150",
                    isExpanded && "rotate-90",
                  )}
                />
              </RACButton>
            ) : (
              <span className="size-5 shrink-0" />
            )}
            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" />
            )}
            <div className="pointer-events-none flex flex-1 items-center gap-2 truncate">
              {typeof children === "function" ? children(renderProps) : children}
            </div>
          </div>
        );
      }}
    </RACTreeItemContent>
  );
}

export function TreeItem<T extends object = object>({
  className,
  title,
  children,
  textValue,
  ...props
}: TreeItemProps<T>) {
  const computedTextValue = textValue ?? (typeof title === "string" ? title : undefined);

  return (
    <RACTreeItem
      {...props}
      textValue={computedTextValue}
      className={composeRenderProps(className, (cls, { isFocused, isSelected, isDisabled }) =>
        cn(
          "group relative flex flex-col rounded-sm outline-hidden select-none",
          "pl-[calc((var(--tree-item-level,1)-1)*1.25rem)]",
          isSelected && "bg-muted/40",
          isFocused && "ring-1 ring-ring",
          isDisabled && "pointer-events-none opacity-50",
          cls,
        ),
      )}
    >
      {title != null ? (
        <>
          <TreeItemContent>{title}</TreeItemContent>
          {children}
        </>
      ) : (
        children
      )}
    </RACTreeItem>
  );
}

export interface TreeProps<T extends object = object> extends Omit<RACTreeProps<T>, "children"> {
  children?: ReactNode;
  treeData?: TreeNodeData[];
  checkable?: boolean;
  checkedKeys?:
    | (string | number)[]
    | Set<string | number>
    | { checked: (string | number)[]; halfChecked?: (string | number)[] };
  onCheck?: (checkedKeys: (string | number)[]) => void;
  onNodeAction?: (node: TreeNodeData) => void;
  defaultExpandAll?: boolean;
}

function collectParentKeys(nodes: TreeNodeData[]): Key[] {
  const keys: Key[] = [];
  function traverse(list: TreeNodeData[]) {
    for (const item of list) {
      if (item.children !== undefined && item.children.length > 0) {
        keys.push(String(item.key));
        traverse(item.children);
      }
    }
  }
  traverse(nodes);
  return keys;
}

function collectAllKeys(nodes: TreeNodeData[]): (string | number)[] {
  const keys: (string | number)[] = [];
  function traverse(list: TreeNodeData[]) {
    for (const item of list) {
      keys.push(item.key);
      if (item.children !== undefined && item.children.length > 0) {
        traverse(item.children);
      }
    }
  }
  traverse(nodes);
  return keys;
}

function renderDeclarativeTreeNodes(
  nodes: TreeNodeData[],
  onNodeAction?: (node: TreeNodeData) => void,
): ReactNode {
  return nodes.map((node) => {
    const itemProps: TreeItemProps = {
      id: String(node.key),
      textValue: typeof node.title === "string" ? node.title : String(node.key),
      title: node.title,
    };
    if (node.disabled !== undefined) {
      itemProps.isDisabled = node.disabled;
    }
    if (onNodeAction !== undefined) {
      itemProps.onAction = () => {
        onNodeAction(node);
      };
    }

    return (
      <TreeItem key={node.key} {...itemProps}>
        {node.children !== undefined && node.children.length > 0
          ? renderDeclarativeTreeNodes(node.children, onNodeAction)
          : null}
      </TreeItem>
    );
  });
}

function resolveSelectedKeys(
  customSelectedKeys?: "all" | Iterable<Key>,
  checkedKeys?:
    | (string | number)[]
    | Set<string | number>
    | { checked: (string | number)[]; halfChecked?: (string | number)[] },
): "all" | Iterable<Key> | undefined {
  if (customSelectedKeys !== undefined) {
    return customSelectedKeys;
  }
  if (checkedKeys !== undefined) {
    if (Array.isArray(checkedKeys)) {
      return new Set<Key>(checkedKeys.map(String));
    }
    if (checkedKeys instanceof Set) {
      return new Set<Key>(Array.from(checkedKeys).map(String));
    }
    if (typeof checkedKeys === "object" && checkedKeys !== null && "checked" in checkedKeys) {
      return new Set<Key>(checkedKeys.checked.map(String));
    }
  }
  return undefined;
}

export function Tree<T extends object = object>({
  children,
  treeData,
  checkable = false,
  checkedKeys,
  onCheck,
  onNodeAction,
  selectionMode: customSelectionMode,
  selectionBehavior: customSelectionBehavior,
  selectedKeys: customSelectedKeys,
  onSelectionChange: customOnSelectionChange,
  defaultExpandAll = false,
  defaultExpandedKeys: customDefaultExpandedKeys,
  className,
  "aria-label": ariaLabel,
  ...props
}: TreeProps<T>) {
  const allParentKeys =
    treeData !== undefined && defaultExpandAll ? collectParentKeys(treeData) : undefined;

  const defaultExpandedKeys = customDefaultExpandedKeys ?? allParentKeys;

  const resolvedSelectionMode = customSelectionMode ?? (checkable ? "multiple" : undefined);
  const resolvedSelectionBehavior =
    customSelectionBehavior ??
    (checkable ? "toggle" : resolvedSelectionMode === "single" ? "replace" : undefined);

  const selectedKeys = resolveSelectedKeys(customSelectedKeys, checkedKeys);

  const handleSelectionChange = (selection: Selection) => {
    customOnSelectionChange?.(selection);

    if (onCheck !== undefined && treeData !== undefined) {
      if (selection === "all") {
        onCheck(collectAllKeys(treeData));
      } else {
        const keyMap = new Map<string, string | number>();
        for (const k of collectAllKeys(treeData)) {
          keyMap.set(String(k), k);
        }
        const numericOrOriginalKeys: (string | number)[] = [];
        for (const k of selection) {
          const original = keyMap.get(String(k));
          if (original !== undefined) {
            numericOrOriginalKeys.push(original);
          } else {
            numericOrOriginalKeys.push(
              typeof k === "string" && !Number.isNaN(Number(k)) ? Number(k) : k,
            );
          }
        }
        onCheck(numericOrOriginalKeys);
      }
    }
  };

  const racTreeProps: RACTreeProps<T> = {
    ...props,
    "aria-label": ariaLabel ?? "Tree",
    className: composeRenderProps(className, (cls) =>
      cn("flex flex-col gap-0.5 outline-hidden", cls),
    ),
  };
  if (resolvedSelectionMode !== undefined) {
    racTreeProps.selectionMode = resolvedSelectionMode;
  }
  if (resolvedSelectionBehavior !== undefined) {
    racTreeProps.selectionBehavior = resolvedSelectionBehavior;
  }
  if (selectedKeys !== undefined) {
    racTreeProps.selectedKeys = selectedKeys;
  }
  if (defaultExpandedKeys !== undefined) {
    racTreeProps.defaultExpandedKeys = defaultExpandedKeys;
  }
  if (customOnSelectionChange !== undefined || onCheck !== undefined) {
    racTreeProps.onSelectionChange = handleSelectionChange;
  }

  return (
    <RACTree {...racTreeProps}>
      {treeData !== undefined ? renderDeclarativeTreeNodes(treeData, onNodeAction) : children}
    </RACTree>
  );
}
