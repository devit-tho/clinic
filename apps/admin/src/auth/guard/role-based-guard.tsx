import { usePermissionAccess } from "@/hooks/use-permission-access";
import { PropsWithChildren } from "react";

// ----------------------------------------------------------------------

interface RoleBasedGuardProp {
  roles?: string[];
}

// ----------------------------------------------------------------------

const RoleBasedGuard: React.FC<PropsWithChildren<RoleBasedGuardProp>> = ({
  children,
  roles,
}) => {
  const { handlePermission } = usePermissionAccess();

  if (typeof roles !== "undefined" && handlePermission(roles)) {
    return <div className="">You don't have access for this page</div>;
  }

  return <>{children}</>;
};

export default RoleBasedGuard;
