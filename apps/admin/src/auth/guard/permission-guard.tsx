import { usePermissionAccess } from "@/hooks/use-permission-access";
import { Action, Resource } from "@repo/permissions";
import { PropsWithChildren } from "react";

interface PermissionGuardProps {
  resource: Resource;
  actions: Action | Action[];
}

export const PermissionGuard = ({
  resource,
  actions,
  children,
}: PropsWithChildren<PermissionGuardProps>) => {
  const { handlePermission } = usePermissionAccess();

  const hasPermission = handlePermission({
    resource,
    actions,
  });

  if (!hasPermission) {
    return <div>You don't have permission to access this page</div>;
  }

  return <>{children}</>;
};
