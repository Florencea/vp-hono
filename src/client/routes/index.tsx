import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import logo from "../assets/logo.svg";
import { Button } from "../components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import { useI18n } from "../hooks/useI18n.ts";
import { useUserInfo } from "../hooks/useUserInfo.ts";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const { account, menuItems } = useUserInfo();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="size-12 shrink-0 rounded-lg p-2 bg-muted/40 shadow-xs mr-4"
          />
          <div className="flex flex-col">
            <CardTitle>{t("routes./")}</CardTitle>
            <CardDescription>
              {account !== undefined && account !== ""
                ? t("common.welcomeUser", { name: account })
                : t("common.welcomeSystem")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.key}
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 text-card-foreground shadow-2xs transition-all hover:bg-muted/50 hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
