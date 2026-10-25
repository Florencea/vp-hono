import { useForm } from "@tanstack/react-form";
import type { DepartmentFormValues } from "../../hooks/useDepartments.ts";
import { useI18n } from "../../hooks/useI18n.ts";
import type { DepartmentItem } from "../../types/api.ts";
import { DataModal } from "../common/DataModal.tsx";
import { FieldItem } from "../ui/form.tsx";
import { NumberField } from "../ui/number-field.tsx";
import { FieldError, Input, Label, TextField } from "../ui/textfield.tsx";
import { TreeSelect } from "../ui/tree-select.tsx";

export interface DepartmentModalProps {
  open: boolean;
  department: DepartmentItem | null;
  parentPresetId: number | null;
  departments: DepartmentItem[];
  formKey: string;
  confirmLoading: boolean;
  onCancel: () => void;
  onSubmit: (values: DepartmentFormValues) => void;
}

function DepartmentForm({
  department,
  parentPresetId,
  departments,
  confirmLoading,
  onSubmit,
}: {
  department: DepartmentItem | null;
  parentPresetId: number | null;
  departments: DepartmentItem[];
  confirmLoading: boolean;
  onSubmit: (values: DepartmentFormValues) => void;
}) {
  const { t, locale } = useI18n();

  const defaultValues: DepartmentFormValues = {
    name: department?.name ?? "",
    parentId: department !== null ? (department.parentId ?? 0) : (parentPresetId ?? 0),
    sort: department?.sort ?? 1,
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  const getRequiredMessage = (label: string) => {
    return locale === "zh-TW" ? `請輸入${label}` : `Please enter ${label}`;
  };

  const treeSelectData = [
    { title: t("dept.root"), value: 0, key: 0 },
    ...departments
      .filter((d) => d.id !== department?.id)
      .map((d) => ({
        title: d.name,
        value: d.id,
        key: d.id.toString(),
      })),
  ];

  return (
    <form
      id="department-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="name"
        validators={{
          onSubmit: ({ value }) =>
            !value || !value.trim() ? getRequiredMessage(t("dept.name")) : undefined,
          onChange: ({ value }) => (value && value.trim() ? undefined : undefined),
        }}
      >
        {(field) => {
          const error = field.state.meta.errors[0];
          return (
            <TextField
              name={field.name}
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              isInvalid={!!error}
              isRequired
              isDisabled={confirmLoading}
            >
              <Label>{t("dept.name")}</Label>
              <Input autoFocus placeholder={t("dept.name")} />
              {error && <FieldError>{error}</FieldError>}
            </TextField>
          );
        }}
      </form.Field>

      <form.Field name="parentId">
        {(field) => (
          <FieldItem label={t("dept.parent")}>
            <TreeSelect
              treeData={treeSelectData}
              value={field.state.value}
              onChange={(val) => field.handleChange(typeof val === "number" ? val : 0)}
              placeholder={t("dept.parent")}
              allowClear
              disabled={confirmLoading}
            />
          </FieldItem>
        )}
      </form.Field>

      <form.Field name="sort">
        {(field) => (
          <NumberField
            label={t("dept.sort")}
            minValue={0}
            value={Number(field.state.value)}
            onChange={(val) => field.handleChange(val)}
            isDisabled={confirmLoading}
          />
        )}
      </form.Field>
    </form>
  );
}

export function DepartmentModal({
  open,
  department,
  parentPresetId,
  departments,
  formKey,
  confirmLoading,
  onCancel,
  onSubmit,
}: DepartmentModalProps) {
  const { t } = useI18n();
  const isEdit = department !== null;

  return (
    <DataModal
      open={open}
      title={isEdit ? t("dept.edit") : t("dept.create")}
      onCancel={onCancel}
      onOk={() => {
        const formEl = document.getElementById("department-form");
        if (formEl instanceof HTMLFormElement) {
          formEl.requestSubmit();
        }
      }}
      confirmLoading={confirmLoading}
    >
      {open && (
        <DepartmentForm
          key={formKey}
          department={department}
          parentPresetId={parentPresetId}
          departments={departments}
          confirmLoading={confirmLoading}
          onSubmit={onSubmit}
        />
      )}
    </DataModal>
  );
}
