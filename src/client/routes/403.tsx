import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Home, ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { useI18n } from "../hooks/useI18n.ts";

export const Route = createFileRoute("/403")({
  component: ForbiddenPage,
});

function ForbiddenPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="flex w-full max-w-md flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8 stroke-2" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          {t("forbidden.title")}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">{t("forbidden.description")}</p>
        <Button
          variant="default"
          onClick={() => {
            void navigate({ to: "/" });
          }}
        >
          <Home className="size-4" aria-hidden="true" />
          {t("forbidden.backHome")}
        </Button>
      </Card>
    </div>
  );
}
