export enum RootRoute {
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
}

export enum AuthRoute {
  LOGIN = 'login',
}

export enum DashboardRoute {
  // Service
  PATIENT = 'patient',
  INVOICE = 'invoice',

  // Management
  TREATMENT = 'treatment',
  USER = 'user',
  SETTINGS = 'settings',
}

export enum ActionRoute {
  CREATE = 'create',
  EDIT = 'edit',
  PERMISSION = 'permission',
  RESET_PASSWORD = 'reset-password',
}

export default {
  auth: {
    login: `${RootRoute.AUTH}/${AuthRoute.LOGIN}`,
  },

  dashboard: {
    root: `/${RootRoute.DASHBOARD}`,

    patient: {
      root: `/${RootRoute.DASHBOARD}/${DashboardRoute.PATIENT}`,
      create: `/${RootRoute.DASHBOARD}/${DashboardRoute.PATIENT}/${ActionRoute.CREATE}`,
      edit: (id: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.PATIENT}/${id}/${ActionRoute.EDIT}`,
      invoice: (id: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.PATIENT}/${id}/${DashboardRoute.INVOICE}`,
      invoiceCreate: (id: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.PATIENT}/${id}/${DashboardRoute.INVOICE}/${ActionRoute.CREATE}`,
      invoiceEdit: (patientId: string, invoiceId: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.PATIENT}/${patientId}/${DashboardRoute.INVOICE}/${invoiceId}/${ActionRoute.EDIT}`,
    },
    invoice: {
      root: `/${RootRoute.DASHBOARD}/${DashboardRoute.INVOICE}`,
      details: (id: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.INVOICE}/${id}/details`,
    },
    user: {
      root: `/${RootRoute.DASHBOARD}/${DashboardRoute.USER}`,
      create: `/${RootRoute.DASHBOARD}/${DashboardRoute.USER}/${ActionRoute.CREATE}`,
      edit: (id: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.USER}/${id}/${ActionRoute.EDIT}`,
      permission: (userId: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.USER}/${userId}/${ActionRoute.PERMISSION}`,
      resetPassword: (id: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.USER}/${id}/${ActionRoute.RESET_PASSWORD}`,
    },
    treatment: {
      root: `/${RootRoute.DASHBOARD}/${DashboardRoute.TREATMENT}`,
      create: `/${RootRoute.DASHBOARD}/${DashboardRoute.TREATMENT}/${ActionRoute.CREATE}`,
      edit: (id: string) =>
        `/${RootRoute.DASHBOARD}/${DashboardRoute.TREATMENT}/${id}/${ActionRoute.EDIT}`,
    },
  },

  settings: `/${RootRoute.DASHBOARD}/${DashboardRoute.SETTINGS}`,
};
