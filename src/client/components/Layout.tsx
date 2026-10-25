import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import logo from "../assets/logo.svg";
import { APP_TITLE } from "../config.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { useI18n } from "../hooks/useI18n.ts";
import { useUserInfo } from "../hooks/useUserInfo.ts";
import { cn } from "../utils/cn.ts";
import { DocTitle } from "./DocTitle.tsx";
import { I18nSwitcher } from "./I18nSwitcher.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { Badge } from "./ui/badge.tsx";
import { Button } from "./ui/button.tsx";

export const Layout = () => {
  const { t } = useI18n();
  const routerState = useRouterState();
  const { logout } = useAuth();
  const { isLogin, account, menuItems } = useUserInfo();

  const currentPath = routerState.location.pathname;

  return (
    <>
      <DocTitle />
      <div className="flex h-svh max-w-svw flex-col overflow-hidden bg-background text-foreground transition-colors duration-200">
        {isLogin && (
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md">
            <Link
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm ring-offset-background"
              to="/"
            >
              <img className="size-6 shrink-0" src={logo} alt="logo" />
              <span className="shrink-0 text-sm font-semibold tracking-tight sm:text-base">
                {APP_TITLE}
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              {account !== undefined && <Badge variant="secondary">{account}</Badge>}
              <I18nSwitcher />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout.mutate();
                }}
              >
                <LogOut className="size-4" aria-hidden="true" />
                {t("common.logout")}
              </Button>
            </div>
          </header>
        )}

        <div className="flex flex-1 overflow-hidden">
          {isLogin && (
            <aside
              role="complementary"
              aria-label="Sidebar navigation"
              className="relative flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 ease-in-out shrink-0 w-16 md:w-56"
            >
              <nav aria-label="Main Navigation" className="flex-1 overflow-y-auto p-2">
                <ul role="menu" className="flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const isSelected =
                      item.key === "/"
                        ? currentPath === "/"
                        : currentPath === item.key || currentPath.startsWith(item.key + "/");
                    return (
                      <li key={item.key} role="none">
                        <Link
                          to={item.key}
                          role="menuitem"
                          tabIndex={0}
                          title={item.label}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-md px-2 md:px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer justify-center md:justify-start focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-sidebar",
                            isSelected
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                              : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground active:scale-95",
                          )}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <span className="hidden md:inline truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          )}

          <main className="flex-1 overflow-auto bg-muted/15 p-4 lg:p-6 transition-colors">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
