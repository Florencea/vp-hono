import { useForm } from "@tanstack/react-form";
import { Check, Pencil, Plus } from "lucide-react";
import type { DepartmentFormValues } from "../../hooks/useDepartments.ts";
import { useI18n } from "../../hooks/useI18n.ts";
import type { DepartmentItem } from "../../types/api.ts";
import { Button } from "../ui/button.tsx";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog.tsx";
import { NumberField } from "../ui/number-field.tsx";
import { Select } from "../ui/select.tsx";
import { FieldError, Input, Label, TextField } from "../ui/textfield.tsx";

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
  onCancel,
  onSubmit,
}: {
  department: DepartmentItem | null;
  parentPresetId: number | null;
  departments: DepartmentItem[];
  confirmLoading: boolean;
  onCancel: () => void;
  onSubmit: (values: DepartmentFormValues) => void;
}) {
  const { t } = useI18n();

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
    return t("common.pleaseEnter", { field: label });
  };

  const parentOptions = [
    { label: t("dept.root"), value: "0" },
    ...departments
      .filter((d) => d.id !== department?.id)
      .map((d) => ({
        label: d.name,
        value: String(d.id),
      })),
  ];

  const okLabel = t("common.ok");
  const cancelLabel = t("common.cancel");

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
          <Select
            label={t("dept.parent")}
            placeholder={t("dept.parent")}
            options={parentOptions}
            value={String(field.state.value)}
            onChange={(val) => field.handleChange(val !== null ? Number(val) : 0)}
            isDisabled={confirmLoading}
          />
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

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel} isDisabled={confirmLoading}>
          {cancelLabel}
        </Button>
        <Button type="submit" isDisabled={confirmLoading}>
          <Check className="size-4" aria-hidden="true" />
          {okLabel}
        </Button>
      </DialogFooter>
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
    <DialogContent isOpen={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogHeader>
        <DialogTitle>
          <span className="inline-flex items-center gap-2">
            {isEdit ? (
              <Pencil className="size-4.5 text-primary" aria-hidden="true" />
            ) : (
              <Plus className="size-4.5 text-primary" aria-hidden="true" />
            )}
            <span>{isEdit ? t("dept.edit") : t("dept.create")}</span>
          </span>
        </DialogTitle>
      </DialogHeader>
      {open && (
        <DepartmentForm
          key={formKey}
          department={department}
          parentPresetId={parentPresetId}
          departments={departments}
          confirmLoading={confirmLoading}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      )}
    </DialogContent>
  );
}
