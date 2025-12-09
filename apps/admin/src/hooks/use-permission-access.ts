import { useAuth } from "@/auth/hooks";
import { useLocales } from "@/locales";
import { INVOICE, PATIENT } from "@/utils/permission-data";
import { Role, UserPermission } from "@repo/entities";
import { Action, Resource } from "@repo/permissions";

export type PermissionType = string | INVOICE | PATIENT;

export interface Permission {
  name: string;
  key: Resource;
  checked: boolean;
  items: PermissionItem[];
}

interface PermissionItem {
  name: string;
  key: Action;
  checked: boolean;
}

export function usePermissionAccess() {
  const { t } = useLocales();

  const { user } = useAuth();

  const currentRole = user?.role as Role;

  const currentPermissions = user?.permissions as UserPermission;

  const permissions: Permission[] = [
    {
      name: t(Resource.patient), // Patient
      key: Resource.patient,
      checked: false,
      items: [
        {
          name: t(`action.${Action.READ}`), // Read
          key: Action.READ,
          checked: false,
        },
        {
          name: t(`action.${Action.CREATE}`), // Create
          key: Action.CREATE,
          checked: false,
        },
        {
          name: t(`action.${Action.UPDATE}`), // Update
          key: Action.UPDATE,
          checked: false,
        },
        {
          name: t(`action.${Action.DELETE}`), // Delete
          key: Action.DELETE,
          checked: false,
        },
        {
          name: t(`action.${Action.VIEW_INVOICES}`), // View Invoices
          key: Action.VIEW_INVOICES,
          checked: false,
        },
        {
          name: t(`action.${Action.CREATE_INVOICES}`), // Create Invoices
          key: Action.CREATE_INVOICES,
          checked: false,
        },
        {
          name: t(`action.${Action.UPDATE_INVOICES}`), // Update Invoices
          key: Action.UPDATE_INVOICES,
          checked: false,
        },
        {
          name: t(`action.${Action.DELETE_INVOICES}`), // Delete Invoices
          key: Action.DELETE_INVOICES,
          checked: false,
        },
        {
          name: t(`action.${Action.VIEW_DETAILS}`), // View Details
          key: Action.VIEW_DETAILS,
          checked: false,
        },
      ],
    },

    {
      name: t(Resource.invoice), // Invoice
      key: Resource.invoice,
      checked: false,
      items: [
        {
          name: t(`action.${Action.READ}`), // Read
          key: Action.READ,
          checked: false,
        },
        {
          name: t(`action.${Action.PRINT}`), // Print
          key: Action.PRINT,
          checked: false,
        },
        {
          name: t(`action.${Action.VIEW_DETAILS}`), // View Details
          key: Action.VIEW_DETAILS,
          checked: false,
        },
      ],
    },

    {
      name: t(Resource.treatment), // Treatment
      key: Resource.treatment,
      checked: false,
      items: [
        {
          name: t(`action.${Action.READ}`), // Read
          key: Action.READ,
          checked: false,
        },
        {
          name: t(`action.${Action.CREATE}`), // Create
          key: Action.CREATE,
          checked: false,
        },
        {
          name: t(`action.${Action.UPDATE}`), // Update
          key: Action.UPDATE,
          checked: false,
        },
        {
          name: t(`action.${Action.DELETE}`), // Delete
          key: Action.DELETE,
          checked: false,
        },
      ],
    },
  ];

  function handlePermission({
    actions,
    resource,
  }: {
    resource: Resource;
    actions: Action | Action[];
  }) {
    const requiredActions = Array.isArray(actions) ? actions : [actions];

    if (currentRole === Role.ADMIN) {
      return true;
    }

    return currentPermissions.some((permission) => {
      if (permission.resource === resource) {
        return requiredActions.every((action) =>
          permission.actions.includes(action)
        );
      }
      return false;
    });
  }

  return {
    handlePermission,
    permissions,
  };
}
