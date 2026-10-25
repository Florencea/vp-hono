import { useForm } from "@tanstack/react-form";
import type { RoleFormValues } from "../../hooks/useRoles.ts";
import { useI18n } from "../../hooks/useI18n.ts";
import type { DepartmentItem, PermissionItem, RoleItem } from "../../types/api.ts";
import { DataDrawer } from "../common/DataDrawer.tsx";
import { Button } from "../ui/button.tsx";
import { FieldItem } from "../ui/form.tsx";
import { NumberField } from "../ui/number-field.tsx";
import { Radio, RadioGroup } from "../ui/radio-group.tsx";
import { FieldError, Input, Label, TextField } from "../ui/textfield.tsx";
import { TreeSelect } from "../ui/tree-select.tsx";
import { Tree, type TreeNodeData } from "../ui/tree.tsx";

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
  onSubmit,
}: {
  role: RoleItem | null;
  permissions: PermissionItem[];
  departments: DepartmentItem[];
  confirmLoading: boolean;
  onSubmit: (values: RoleFormValues) => void;
}) {
  const { t, locale } = useI18n();
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
    return locale === "zh-TW" ? `請輸入${label}` : `Please enter ${label}`;
  };

  const permissionTreeData: TreeNodeData[] = permissions.map((p) => ({
    key: p.id,
    title: `${p.name} (${p.code})`,
  }));

  const deptTreeData = departments.map((d) => ({
    title: d.name,
    value: d.id,
    key: d.id.toString(),
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
      className="flex flex-col gap-4"
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
                <FieldItem label={t("role.customDepts")} required>
                  <TreeSelect
                    treeData={deptTreeData}
                    treeCheckable
                    value={field.state.value ?? undefined}
                    onChange={(val) => {
                      field.handleChange(
                        Array.isArray(val)
                          ? val.map((v) => (typeof v === "number" ? v : Number(v)))
                          : [],
                      );
                    }}
                    placeholder={t("role.customDepts")}
                    disabled={confirmLoading}
                  />
                </FieldItem>
              )}
            </form.Field>
          ) : null
        }
      </form.Subscribe>

      <form.Field name="permissionIds">
        {(field) => (
          <FieldItem label={t("role.permissions")}>
            <div className="rounded-md border border-border p-2">
              <Tree
                checkable
                treeData={permissionTreeData}
                checkedKeys={field.state.value}
                onCheck={(checkedKeys) => {
                  field.handleChange(
                    checkedKeys.map((k) => (typeof k === "number" ? k : Number(k))),
                  );
                }}
              />
            </div>
          </FieldItem>
        )}
      </form.Field>
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
    <DataDrawer
      open={open}
      title={isEdit ? t("role.edit") : t("role.create")}
      onClose={onClose}
      size="large"
      extra={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="default"
            size="sm"
            isDisabled={confirmLoading}
            onClick={() => {
              const formEl = document.getElementById("role-form");
              if (formEl instanceof HTMLFormElement) {
                formEl.requestSubmit();
              }
            }}
          >
            {t("common.save")}
          </Button>
        </div>
      }
    >
      {open && (
        <RoleForm
          key={formKey}
          role={role}
          permissions={permissions}
          departments={departments}
          confirmLoading={confirmLoading}
          onSubmit={onSubmit}
        />
      )}
    </DataDrawer>
  );
}
