import { useAuth } from "@/auth/hooks";
import { INVOICE, PATIENT } from "@/utils/permission-data";

export type PermissionType = string | INVOICE | PATIENT;

export function usePermissionAccess() {
  const { user } = useAuth();

  const currentRole = user?.role as string;
  const currentPermission = user?.permission?.values as string[];

  function handlePermission(permissions: PermissionType[]) {
    return !permissions.some(
      (permission) =>
        permission === currentRole || currentPermission.includes(permission)
    );
  }

  return {
    handlePermission,
  };
}
