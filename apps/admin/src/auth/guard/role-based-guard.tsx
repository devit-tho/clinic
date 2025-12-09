import { Role } from "@repo/entities";
import { PropsWithChildren } from "react";
import { useAuth } from "../hooks";

// ----------------------------------------------------------------------

interface RoleBasedGuardProp {
  roles?: Role[];
}

// ----------------------------------------------------------------------

const RoleBasedGuard: React.FC<PropsWithChildren<RoleBasedGuardProp>> = ({
  children,
  roles,
}) => {
  const { user } = useAuth();

  if (user && user.role === Role.ADMIN) {
    return <>{children}</>;
  }

  if (typeof roles !== "undefined" && !roles.includes(user?.role as Role)) {
    return <div className="">You don't have access for this page</div>;
  }

  return <>{children}</>;
};

export default RoleBasedGuard;
