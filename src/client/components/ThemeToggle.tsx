import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme.tsx";
import { Button } from "./ui/button.tsx";

export interface ThemeToggleProps {
  className?: string | undefined;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="size-4 rotate-0 scale-100 transition-transform duration-300 dark:rotate-0" />
      ) : (
        <Moon className="size-4 rotate-0 scale-100 transition-transform duration-300" />
      )}
    </Button>
  );
}
