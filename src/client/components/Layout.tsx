import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
import { APP_TITLE } from "../config.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { useI18n } from "../hooks/useI18n.ts";
import { useUserInfo } from "../hooks/useUserInfo.ts";
import { cn } from "../utils/cn.ts";
import { DocTitle } from "./DocTitle.tsx";
import { I18nSwitcher } from "./I18nSwitcher.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { Button } from "./ui/button.tsx";

export const Layout = () => {
  const { t } = useI18n();
  const routerState = useRouterState();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const { isLogin, account, menuItems } = useUserInfo();

  const currentPath = routerState.location.pathname;

  return (
    <>
      <DocTitle />
      <div className="flex h-svh max-w-svw flex-col overflow-hidden bg-background text-foreground transition-colors duration-200">
        {isLogin && (
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-background/95 px-3 lg:px-4 backdrop-blur-md">
            <Link
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
              to="/"
            >
              <img className="h-6 w-6 shrink-0" src={logo} alt="logo" />
              <span className="shrink-0 text-sm font-semibold tracking-wide sm:text-base">
                {APP_TITLE}
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              {account !== undefined && (
                <span className="text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {account}
                </span>
              )}
              <I18nSwitcher />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout.mutate();
                }}
              >
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
              className={cn(
                "relative flex flex-col border-r border-border bg-background transition-all duration-300 ease-in-out shrink-0",
                collapsed ? "w-16" : "w-52",
              )}
            >
              <nav aria-label="Main Navigation" className="flex-1 overflow-y-auto p-2">
                <ul role="menu" className="flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const isSelected = currentPath === item.key;
                    return (
                      <li key={item.key} role="none">
                        <Link
                          to={item.key}
                          role="menuitem"
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer",
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95",
                            collapsed && "justify-center px-2",
                          )}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <button
                type="button"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
                className="flex h-10 w-full items-center justify-center border-t border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors duration-150"
              >
                {collapsed ? (
                  <ChevronRight
                    role="img"
                    aria-label="right"
                    className="h-4 w-4 transition-transform"
                  />
                ) : (
                  <ChevronLeft
                    role="img"
                    aria-label="left"
                    className="h-4 w-4 transition-transform"
                  />
                )}
              </button>
            </aside>
          )}

          <main className="flex-1 overflow-auto bg-muted/20 p-4 transition-colors">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
