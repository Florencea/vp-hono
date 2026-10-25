import { useForm } from "@tanstack/react-form";
import { Check, Pencil, Plus } from "lucide-react";
import { useI18n } from "../../hooks/useI18n.ts";
import type { UserFormValues } from "../../hooks/useUsers.ts";
import type { DepartmentItem, RoleItem, UserItem } from "../../types/api.ts";
import { Button } from "../ui/button.tsx";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog.tsx";
import { MultiSelect } from "../ui/multi-select.tsx";
import { PasswordInput } from "../ui/password-input.tsx";
import { Radio, RadioGroup } from "../ui/radio-group.tsx";
import { Select } from "../ui/select.tsx";
import { FieldError, Input, Label, TextField } from "../ui/textfield.tsx";

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
  onCancel,
  onSubmit,
}: {
  user: UserItem | null;
  departments: DepartmentItem[];
  roles: RoleItem[];
  confirmLoading: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => void;
}) {
  const { t } = useI18n();
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
    return t("common.pleaseEnter", { field: label });
  };

  const deptOptions = [
    { label: t("dept.root"), value: "0" },
    ...departments.map((d) => ({
      label: d.name,
      value: String(d.id),
    })),
  ];

  const roleOptions = roles.map((r) => ({
    label: r.name,
    value: r.id,
  }));

  const okLabel = t("common.ok");
  const cancelLabel = t("common.cancel");

  return (
    <form
      id="user-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4 max-h-128 overflow-y-auto pr-1"
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
              return t("errors.user.passwordMinLength");
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
          <Select
            label={t("user.department")}
            placeholder={t("user.department")}
            options={deptOptions}
            value={field.state.value ? String(field.state.value) : "0"}
            onChange={(val) => {
              const num = Number(val);
              field.handleChange(num > 0 ? num : null);
            }}
            isDisabled={confirmLoading}
          />
        )}
      </form.Field>

      <form.Field name="roleIds">
        {(field) => (
          <MultiSelect
            label={t("user.roles")}
            placeholder={t("user.roles")}
            options={roleOptions}
            value={field.state.value}
            onChange={(vals) => field.handleChange(vals)}
            disabled={confirmLoading}
          />
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
    <DialogContent isOpen={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogHeader>
        <DialogTitle>
          <span className="inline-flex items-center gap-2">
            {isEdit ? (
              <Pencil className="size-4.5 text-primary" aria-hidden="true" />
            ) : (
              <Plus className="size-4.5 text-primary" aria-hidden="true" />
            )}
            <span>{isEdit ? t("user.edit") : t("user.create")}</span>
          </span>
        </DialogTitle>
      </DialogHeader>
      {open && (
        <UserForm
          key={formKey}
          user={user}
          departments={departments}
          roles={roles}
          confirmLoading={confirmLoading}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      )}
    </DialogContent>
  );
}
