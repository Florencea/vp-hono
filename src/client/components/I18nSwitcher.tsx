import { Globe, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import { isSupportedLocale } from "../../locales/registry.ts";
import { useI18n } from "../hooks/useI18n.ts";
import { Button } from "./ui/button.tsx";
import { cn } from "../utils/cn.ts";

export const I18nSwitcher = () => {
  const { t, locale, setLocale, supportedLocales } = useI18n();
  const queryClient = useQueryClient();

  return (
    <MenuTrigger>
      <Button
        variant="ghost"
        size="icon"
        className="flex items-center justify-center"
        aria-label={t("common.changeLanguage")}
        title={t("common.changeLanguage")}
      >
        <Globe className="h-4 w-4" />
      </Button>
      <Popover
        placement="bottom end"
        className="min-w-32 overflow-hidden rounded-md border border-border bg-background p-1 text-foreground shadow-md outline-none"
      >
        <Menu
          onAction={(key) => {
            const langKey = String(key);
            if (isSupportedLocale(langKey)) {
              setLocale(langKey);
              void queryClient.invalidateQueries();
            }
          }}
          className="outline-none"
        >
          {Object.entries(supportedLocales).map(([key, meta]) => {
            const isSelected = key === locale;
            return (
              <MenuItem
                key={key}
                id={key}
                textValue={meta.name}
                className={cn(
                  "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  "hover:bg-muted focus:bg-muted pressed:bg-muted/80",
                  isSelected && "font-medium text-primary",
                )}
              >
                <span>{meta.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </MenuItem>
            );
          })}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
