import { useState } from "react";
import { expect, test } from "vite-plus/test";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../src/client/components/ui/dialog.tsx";
import { Select } from "../../src/client/components/ui/select.tsx";
import { SheetContent, SheetHeader, SheetTitle } from "../../src/client/components/ui/sheet.tsx";
import { renderComponent } from "./test-utils";

function TestDialog() {
  const [open, setOpen] = useState(true);
  return (
    <DialogContent isOpen={open} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>Test Dialog</DialogTitle>
      </DialogHeader>
      <div>Dialog Body Content</div>
    </DialogContent>
  );
}

function TestSheet() {
  const [open, setOpen] = useState(true);
  return (
    <SheetContent isOpen={open} onOpenChange={setOpen}>
      <SheetHeader>
        <SheetTitle>Test Sheet</SheetTitle>
      </SheetHeader>
      <div>Sheet Body Content</div>
    </SheetContent>
  );
}

const SELECT_OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
];

function TestSelect() {
  return <Select label="Test Select" placeholder="Choose..." options={SELECT_OPTIONS} />;
}

test("Visual Overlay Safety: Dialog modal renders opaque backdrop and styled modal card", async () => {
  const screen = await renderComponent(<TestDialog />);

  const dialog = screen.getByRole("dialog");
  await expect.element(dialog).toBeVisible();

  // The modal element is the parent Modal container of RACDialog
  const modalEl = dialog.element().parentElement;
  expect(modalEl).not.toBeNull();
  if (modalEl === null) {
    throw new Error("Expected modalEl not to be null");
  }

  expect(modalEl.className).toContain("bg-background");

  // Modal card should have solid white/theme background, not transparent
  const modalComputed = window.getComputedStyle(modalEl);
  expect(modalComputed.backgroundColor).toBe("rgb(255, 255, 255)");
  expect(modalComputed.position).toBe("relative");
});

test("Visual Overlay Safety: Sheet drawer renders opaque backdrop and right slide-in container", async () => {
  const screen = await renderComponent(<TestSheet />);

  const sheet = screen.getByRole("dialog");
  await expect.element(sheet).toBeVisible();

  // The sheet container is the parent Modal element of RACDialog
  const sheetEl = sheet.element().parentElement;
  expect(sheetEl).not.toBeNull();
  if (sheetEl === null) {
    throw new Error("Expected sheetEl not to be null");
  }

  expect(sheetEl.className).toContain("bg-background");

  const sheetComputed = window.getComputedStyle(sheetEl);
  expect(sheetComputed.backgroundColor).toBe("rgb(255, 255, 255)");
  expect(sheetComputed.position).toBe("fixed");
});

test("Visual Overlay Safety: Select popover opens with opaque popover background and border", async () => {
  const screen = await renderComponent(<TestSelect />);

  const button = screen.getByRole("button", { name: /Choose.../i });
  await button.click();

  const listbox = screen.getByRole("listbox");
  await expect.element(listbox).toBeVisible();

  // The popover container is the parent Popover element of ListBox
  const popoverEl = listbox.element().parentElement;
  expect(popoverEl).not.toBeNull();
  if (popoverEl === null) {
    throw new Error("Expected popoverEl not to be null");
  }

  expect(popoverEl.className).toContain("bg-popover");

  const popoverComputed = window.getComputedStyle(popoverEl);
  expect(popoverComputed.backgroundColor).toBe("rgb(255, 255, 255)");
});
