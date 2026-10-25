import { useForm } from "@tanstack/react-form";
import type { RoleFormValues } from "../../hooks/useRoles.ts";
import { useI18n } from "../../hooks/useI18n.ts";
import type { DepartmentItem, PermissionItem, RoleItem } from "../../types/api.ts";
import { Button } from "../ui/button.tsx";
import { Checkbox } from "../ui/checkbox.tsx";
import { MultiSelect } from "../ui/multi-select.tsx";
import { NumberField } from "../ui/number-field.tsx";
import { Radio, RadioGroup } from "../ui/radio-group.tsx";
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet.tsx";
import { FieldError, Input, Label, TextField } from "../ui/textfield.tsx";

export interface RoleDrawerProps {
  open: boolean;
  role: RoleItem | null;
  permissions: PermissionItem[];
  departments: DepartmentItem[];
  formKey: string;
  confirmLoading: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
}

const isDataScope = (v: string): v is RoleItem["dataScope"] =>
  v === "ALL" || v === "DEPT_AND_CHILD" || v === "DEPT" || v === "SELF" || v === "CUSTOM";

function RoleForm({
  role,
  permissions,
  departments,
  confirmLoading,
  onClose,
  onSubmit,
}: {
  role: RoleItem | null;
  permissions: PermissionItem[];
  departments: DepartmentItem[];
  confirmLoading: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
}) {
  const { t } = useI18n();
  const isEdit = role !== null;

  const defaultValues: RoleFormValues = {
    code: role?.code ?? "",
    name: role?.name ?? "",
    description: role?.description ?? "",
    dataScope: role?.dataScope ?? "SELF",
    sort: role?.sort ?? 1,
    departmentIds: role?.departmentIds ?? [],
    permissionIds: role?.permissionIds ?? [],
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

  const deptOptions = departments.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  return (
    <form
      id="role-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1"
    >
      <form.Field
        name="code"
        validators={{
          onSubmit: ({ value }) =>
            !value || !value.trim() ? getRequiredMessage(t("role.code")) : undefined,
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
              isDisabled={confirmLoading || isEdit}
            >
              <Label>{t("role.code")}</Label>
              <Input autoFocus placeholder={t("role.code")} />
              {error && <FieldError>{error}</FieldError>}
            </TextField>
          );
        }}
      </form.Field>

      <form.Field
        name="name"
        validators={{
          onSubmit: ({ value }) =>
            !value || !value.trim() ? getRequiredMessage(t("role.name")) : undefined,
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
              <Label>{t("role.name")}</Label>
              <Input placeholder={t("role.name")} />
              {error && <FieldError>{error}</FieldError>}
            </TextField>
          );
        }}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <TextField
            name={field.name}
            value={field.state.value ?? ""}
            onChange={(val) => field.handleChange(val)}
            isDisabled={confirmLoading}
          >
            <Label>{t("role.description")}</Label>
            <Input placeholder={t("role.description")} />
          </TextField>
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

      <form.Field name="dataScope">
        {(field) => (
          <RadioGroup
            label={t("role.dataScope")}
            value={field.state.value}
            onChange={(val) => {
              if (isDataScope(val)) {
                field.handleChange(val);
              }
            }}
            isDisabled={confirmLoading}
          >
            <Radio value="ALL">{t("role.scopes.ALL")}</Radio>
            <Radio value="DEPT_AND_CHILD">{t("role.scopes.DEPT_AND_CHILD")}</Radio>
            <Radio value="DEPT">{t("role.scopes.DEPT")}</Radio>
            <Radio value="SELF">{t("role.scopes.SELF")}</Radio>
            <Radio value="CUSTOM">{t("role.scopes.CUSTOM")}</Radio>
          </RadioGroup>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.values.dataScope}>
        {(selectedScope) =>
          selectedScope === "CUSTOM" ? (
            <form.Field name="departmentIds">
              {(field) => (
                <MultiSelect
                  label={t("role.customDepts")}
                  placeholder={t("role.customDepts")}
                  options={deptOptions}
                  value={field.state.value}
                  onChange={(vals) => field.handleChange(vals)}
                  disabled={confirmLoading}
                />
              )}
            </form.Field>
          ) : null
        }
      </form.Subscribe>

      <form.Field name="permissionIds">
        {(field) => (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">{t("role.permissions")}</span>
            <div className="rounded-md border border-border p-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
              {permissions.map((p) => {
                const isChecked = field.state.value.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none"
                  >
                    <Checkbox
                      isSelected={isChecked}
                      onChange={(checked) => {
                        const next = checked
                          ? [...field.state.value, p.id]
                          : field.state.value.filter((id) => id !== p.id);
                        field.handleChange(next);
                      }}
                      isDisabled={confirmLoading}
                    />
                    <span>
                      {p.name} ({p.code})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </form.Field>

      <SheetFooter>
        <Button variant="outline" type="button" onClick={onClose} isDisabled={confirmLoading}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" isDisabled={confirmLoading}>
          {t("common.save")}
        </Button>
      </SheetFooter>
    </form>
  );
}

export function RoleDrawer({
  open,
  role,
  permissions,
  departments,
  formKey,
  confirmLoading,
  onClose,
  onSubmit,
}: RoleDrawerProps) {
  const { t } = useI18n();
  const isEdit = role !== null;

  return (
    <SheetContent isOpen={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetHeader>
        <SheetTitle>{isEdit ? t("role.edit") : t("role.create")}</SheetTitle>
      </SheetHeader>
      {open && (
        <RoleForm
          key={formKey}
          role={role}
          permissions={permissions}
          departments={departments}
          confirmLoading={confirmLoading}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </SheetContent>
  );
}
