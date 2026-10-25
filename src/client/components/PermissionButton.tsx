import { Button, type ButtonProps } from "./ui/button.tsx";
import { useAccess } from "../hooks/useAccess.ts";

export interface PermissionButtonProps extends ButtonProps {
  permission: string | string[];
  permissionMode?: "hide" | "disable" | undefined;
}

/**
 * Highly ergonomic button seamlessly integrated with RBAC permission gate.
 * Displays, disables, or completely hides the button based on the user's active permissions.
 */
export function PermissionButton({
  permission,
  permissionMode = "hide",
  isDisabled,
  disabled,
  ...props
}: PermissionButtonProps) {
  const { hasPermission } = useAccess();
  const allowed = hasPermission(permission);
  const shouldDisable = isDisabled ?? disabled;

  if (!allowed) {
    if (permissionMode === "disable") {
      return <Button {...props} isDisabled />;
    }
    return null;
  }

  return (
    <Button {...props} {...(shouldDisable !== undefined ? { isDisabled: shouldDisable } : {})} />
  );
}
