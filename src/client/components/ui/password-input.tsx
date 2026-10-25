import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn.ts";
import { Input, type InputProps } from "./textfield.tsx";

export interface PasswordInputProps extends InputProps {}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex w-full items-center">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        className="text-muted-foreground hover:text-foreground absolute right-2.5 flex items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Hide" : "Show"}
      >
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
