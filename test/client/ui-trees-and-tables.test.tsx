import { expect, test } from "vite-plus/test";
import { useState } from "react";
import { renderComponent } from "./test-utils";
import { Tree, type TreeNodeData } from "../../src/client/components/ui/tree.tsx";
import { TreeSelect, type TreeSelectNode } from "../../src/client/components/ui/tree-select.tsx";
import { DataTable, type DataTableColumn } from "../../src/client/components/common/DataTable.tsx";

test("Tree: renders hierarchy, toggles expansion and handles checkable selection", async () => {
  const treeData: TreeNodeData[] = [
    {
      key: "dept-1",
      title: "總部辦公室",
      children: [
        {
          key: "dept-1-1",
          title: "研發部",
        },
      ],
    },
    {
      key: "dept-2",
      title: "營運部",
    },
  ];

  let selectedKeys: (string | number)[] = [];

  function TestTreeWrapper() {
    const [checked, setChecked] = useState<(string | number)[]>([]);
    return (
      <Tree
        treeData={treeData}
        checkable
        checkedKeys={checked}
        onCheck={(keys) => {
          setChecked(keys);
          selectedKeys = keys;
        }}
        aria-label="Department Tree"
      />
    );
  }

  const screen = await renderComponent(<TestTreeWrapper />);

  // Root node should be visible
  const rootNode = screen.getByText("總部辦公室");
  await expect.element(rootNode).toBeInTheDocument();

  // Expand root node via chevron button inside row
  const rootRow = screen.getByRole("row", { name: /總部辦公室/i });
  const expandBtn = rootRow.getByRole("button");
  await expandBtn.click();

  // Child node should now be visible
  const childNode = screen.getByText("研發部");
  await expect.element(childNode).toBeInTheDocument();

  // Click checkbox on child node
  const childRow = screen.getByRole("row", { name: /研發部/i });
  const childCheckbox = childRow.getByRole("checkbox");
  await childCheckbox.click({ force: true });

  // Verify onCheck callback was invoked with the checked key
  expect(selectedKeys).toContain("dept-1-1");
});

test("TreeSelect: supports single selection, clear, and popup toggle", async () => {
  const treeData: TreeSelectNode[] = [
    {
      value: 1,
      title: "總部",
      children: [
        {
          value: 2,
          title: "技術支援中心",
        },
      ],
    },
  ];

  function TestTreeSelectWrapper() {
    const [value, setValue] = useState<number | undefined>(undefined);
    return (
      <TreeSelect
        treeData={treeData}
        value={value}
        onChange={setValue}
        placeholder="請選擇部門"
        allowClear
      />
    );
  }

  const screen = await renderComponent(<TestTreeSelectWrapper />);

  // Verify placeholder is shown initially
  const trigger = screen.getByRole("button", { name: /請選擇部門/i });
  await expect.element(trigger).toBeInTheDocument();

  // Open the popover
  await trigger.click();

  // Click on the child node "技術支援中心"
  const targetOption = screen.getByText("技術支援中心");
  await targetOption.click();

  // Value should now be updated on the trigger button
  const updatedTrigger = screen.getByRole("button", { name: /技術支援中心/i });
  await expect.element(updatedTrigger).toBeInTheDocument();

  // Click clear button
  const clearBtn = screen.getByRole("button", { name: /技術支援中心/i }).getByRole("button");
  await clearBtn.click();

  // Should revert to placeholder
  await expect.element(screen.getByRole("button", { name: /請選擇部門/i })).toBeInTheDocument();
});

test("TreeSelect: supports treeCheckable multi-selection", async () => {
  const treeData: TreeSelectNode[] = [
    { value: 10, title: "台北分部" },
    { value: 20, title: "台中分部" },
  ];

  function MultiTreeSelectWrapper() {
    const [values, setValues] = useState<number[]>([]);
    return (
      <TreeSelect
        treeData={treeData}
        value={values}
        onChange={setValues}
        treeCheckable
        placeholder="選擇多個部門"
      />
    );
  }

  const screen = await renderComponent(<MultiTreeSelectWrapper />);

  const trigger = screen.getByRole("button", { name: /選擇多個部門/i });
  await trigger.click();

  // Check the first department
  const cb1 = screen.getByRole("row", { name: /台北分部/i }).getByRole("checkbox");
  await cb1.click({ force: true });

  // Verify button name updated to selected item
  await expect.element(screen.getByRole("button", { name: "台北分部" })).toBeInTheDocument();
});

test("DataTable: renders table, handles loading, empty state, and tree row expansion", async () => {
  interface RecordItem {
    id: number;
    name: string;
    description: string;
    children?: RecordItem[];
  }

  const columns: DataTableColumn<RecordItem>[] = [
    { title: "名稱", dataIndex: "name", key: "name", width: 200 },
    { title: "描述", dataIndex: "description", key: "description", width: 300 },
  ];

  const data: RecordItem[] = [
    {
      id: 100,
      name: "父級節點",
      description: "一級組織",
      children: [
        {
          id: 101,
          name: "子級節點",
          description: "二級組織",
        },
      ],
    },
  ];

  // 1. Loading state test
  const loadingScreen = await renderComponent(
    <DataTable<RecordItem> columns={columns} dataSource={[]} loading={true} />,
  );
  await expect.element(loadingScreen.getByRole("grid")).toBeInTheDocument();

  // 2. Empty state test
  const emptyScreen = await renderComponent(
    <DataTable<RecordItem> columns={columns} dataSource={[]} emptyText="暫無數據" />,
  );
  await expect.element(emptyScreen.getByText("暫無數據")).toBeInTheDocument();

  // 3. Tree hierarchy and expand test
  const tableScreen = await renderComponent(
    <DataTable<RecordItem> columns={columns} dataSource={data} ariaLabel="Test Org Table" />,
  );

  const parentRow = tableScreen.getByText("父級節點");
  await expect.element(parentRow).toBeInTheDocument();

  // Expand button should exist for the parent row
  const expandBtn = tableScreen.getByRole("button", { name: /Expand row/i });
  await expandBtn.click();

  // Child row should now be visible
  const childRow = tableScreen.getByText("子級節點");
  await expect.element(childRow).toBeInTheDocument();
});
