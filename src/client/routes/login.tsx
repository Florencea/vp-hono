import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { LoginSearchSchema } from "../../server/routes/auth/auth.schema.ts";
import { I18nSwitcher } from "../components/I18nSwitcher.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { PasswordInput } from "../components/ui/password-input.tsx";
import { FieldError, Input, Label, TextField } from "../components/ui/textfield.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useI18n } from "../hooks/useI18n.ts";

export const Route = createFileRoute("/login")({
  validateSearch: (search) => LoginSearchSchema.parse(search),
  component: Page,
});

function Page() {
  const { t, locale } = useI18n();
  const { login } = useAuth();

  const getRequiredMessage = (label: string) => {
    return locale === "zh-TW" ? `請輸入${label}` : `Please enter ${label}`;
  };

  const form = useForm({
    defaultValues: {
      account: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      login.mutate(value);
    },
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card title={t("auth.login")} extra={<I18nSwitcher />} className="w-full max-w-sm">
        <form
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
                !value || !value.trim() ? getRequiredMessage(t("auth.account")) : undefined,
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
                  isDisabled={login.isPending}
                >
                  <Label>{t("auth.account")}</Label>
                  <Input autoFocus placeholder={t("auth.account")} />
                  {error && <FieldError>{error}</FieldError>}
                </TextField>
              );
            }}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onSubmit: ({ value }) =>
                !value || !value.trim() ? getRequiredMessage(t("auth.password")) : undefined,
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
                  isDisabled={login.isPending}
                >
                  <Label>{t("auth.password")}</Label>
                  <PasswordInput placeholder={t("auth.password")} />
                  {error && <FieldError>{error}</FieldError>}
                </TextField>
              );
            }}
          </form.Field>

          <Button
            type="submit"
            variant="default"
            disabled={login.isPending}
            className="mt-2 w-full"
          >
            {t("common.submit")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
