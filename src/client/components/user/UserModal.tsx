import { useForm } from "@tanstack/react-form";
import { useI18n } from "../../hooks/useI18n.ts";
import type { UserFormValues } from "../../hooks/useUsers.ts";
import type { DepartmentItem, RoleItem, UserItem } from "../../types/api.ts";
import { DataModal } from "../common/DataModal.tsx";
import { FieldItem } from "../ui/form.tsx";
import { PasswordInput } from "../ui/password-input.tsx";
import { Radio, RadioGroup } from "../ui/radio-group.tsx";
import { Select } from "../ui/select.tsx";
import { FieldError, Input, Label, TextField } from "../ui/textfield.tsx";
import { TreeSelect } from "../ui/tree-select.tsx";

export interface UserModalProps {
  open: boolean;
  user: UserItem | null;
  departments: DepartmentItem[];
  roles: RoleItem[];
  formKey: string;
  confirmLoading: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => void;
}

const isUserStatus = (v: string): v is UserItem["status"] =>
  v === "active" || v === "inactive" || v === "suspended";

function UserForm({
  user,
  departments,
  roles,
  confirmLoading,
  onSubmit,
}: {
  user: UserItem | null;
  departments: DepartmentItem[];
  roles: RoleItem[];
  confirmLoading: boolean;
  onSubmit: (values: UserFormValues) => void;
}) {
  const { t, locale } = useI18n();
  const isEdit = user !== null;

  const defaultValues: UserFormValues = {
    account: user?.account ?? "",
    password: "",
    name: user?.name ?? "",
    employeeNo: user?.employeeNo ?? "",
    title: user?.title ?? "",
    status: user?.status ?? "active",
    departmentId: user?.departmentId ?? null,
    roleIds: user?.roleIds ?? [],
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

  const deptTreeData = [
    { title: t("dept.root"), value: 0, key: 0 },
    ...departments.map((d) => ({
      title: d.name,
      value: d.id,
      key: d.id.toString(),
    })),
  ];

  const roleOptions = roles.map((r) => ({
    label: r.name,
    value: r.id,
  }));

  return (
    <form
      id="user-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="account"
        validators={{
          onSubmit: ({ value }) =>
            !value || !value.trim() ? getRequiredMessage(t("user.account")) : undefined,
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
              <Label>{t("user.account")}</Label>
              <Input autoFocus placeholder={t("user.account")} />
              {error && <FieldError>{error}</FieldError>}
            </TextField>
          );
        }}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onSubmit: ({ value }) => {
            if (!isEdit && (!value || !value.trim())) {
              return getRequiredMessage(t("user.password"));
            }
            if (value && value.length > 0 && value.length < 6) {
              return locale === "zh-TW"
                ? "密碼長度不能小於 6 位"
                : "Password must be at least 6 characters";
            }
            return undefined;
          },
          onChange: ({ value }) => (value && value.trim() ? undefined : undefined),
        }}
      >
        {(field) => {
          const error = field.state.meta.errors[0];
          return (
            <TextField
              name={field.name}
              value={field.state.value ?? ""}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              isInvalid={!!error}
              isRequired={!isEdit}
              isDisabled={confirmLoading}
            >
              <Label>{t("user.password")}</Label>
              <PasswordInput
                placeholder={isEdit ? t("user.passwordPlaceholder") : t("user.password")}
              />
              {error && <FieldError>{error}</FieldError>}
            </TextField>
          );
        }}
      </form.Field>

      <form.Field name="name">
        {(field) => (
          <TextField
            name={field.name}
            value={field.state.value ?? ""}
            onChange={(val) => field.handleChange(val)}
            isDisabled={confirmLoading}
          >
            <Label>{t("user.name")}</Label>
            <Input placeholder={t("user.name")} />
          </TextField>
        )}
      </form.Field>

      <form.Field name="employeeNo">
        {(field) => (
          <TextField
            name={field.name}
            value={field.state.value ?? ""}
            onChange={(val) => field.handleChange(val)}
            isDisabled={confirmLoading}
          >
            <Label>{t("user.employeeNo")}</Label>
            <Input placeholder={t("user.employeeNo")} />
          </TextField>
        )}
      </form.Field>

      <form.Field name="title">
        {(field) => (
          <TextField
            name={field.name}
            value={field.state.value ?? ""}
            onChange={(val) => field.handleChange(val)}
            isDisabled={confirmLoading}
          >
            <Label>{t("user.title")}</Label>
            <Input placeholder={t("user.title")} />
          </TextField>
        )}
      </form.Field>

      <form.Field name="departmentId">
        {(field) => (
          <FieldItem label={t("user.department")}>
            <TreeSelect
              treeData={deptTreeData}
              value={field.state.value ?? undefined}
              onChange={(val) => {
                const numeric = typeof val === "number" ? val : Number(val);
                field.handleChange(numeric > 0 ? numeric : null);
              }}
              placeholder={t("user.department")}
              allowClear
              disabled={confirmLoading}
            />
          </FieldItem>
        )}
      </form.Field>

      <form.Field name="roleIds">
        {(field) => (
          <FieldItem label={t("user.roles")}>
            <Select
              mode="multiple"
              options={roleOptions}
              value={field.state.value}
              onChange={(val) => {
                const ids = Array.isArray(val)
                  ? val.filter((item): item is number => typeof item === "number")
                  : [];
                field.handleChange(ids);
              }}
              placeholder={t("user.roles")}
              allowClear
              disabled={confirmLoading}
            />
          </FieldItem>
        )}
      </form.Field>

      <form.Field name="status">
        {(field) => (
          <RadioGroup
            label={t("common.status")}
            value={field.state.value}
            onChange={(val) => {
              if (isUserStatus(val)) {
                field.handleChange(val);
              }
            }}
            isDisabled={confirmLoading}
          >
            <Radio value="active">{t("user.statusActive")}</Radio>
            <Radio value="inactive">{t("user.statusInactive")}</Radio>
            <Radio value="suspended">{t("user.statusSuspended")}</Radio>
          </RadioGroup>
        )}
      </form.Field>
    </form>
  );
}

export function UserModal({
  open,
  user,
  departments,
  roles,
  formKey,
  confirmLoading,
  onCancel,
  onSubmit,
}: UserModalProps) {
  const { t } = useI18n();
  const isEdit = user !== null;

  return (
    <DataModal
      open={open}
      title={isEdit ? t("user.edit") : t("user.create")}
      onCancel={onCancel}
      onOk={() => {
        const formEl = document.getElementById("user-form");
        if (formEl instanceof HTMLFormElement) {
          formEl.requestSubmit();
        }
      }}
      confirmLoading={confirmLoading}
    >
      {open && (
        <UserForm
          key={formKey}
          user={user}
          departments={departments}
          roles={roles}
          confirmLoading={confirmLoading}
          onSubmit={onSubmit}
        />
      )}
    </DataModal>
  );
}
