import AuthGuard from "@/auth/guard/auth-guard";
import { PermissionGuard } from "@/auth/guard/permission-guard";
import RoleBasedGuard from "@/auth/guard/role-based-guard";
import { SplashScreen } from "@/components/loading";
import { DashboardLayout } from "@/layouts/dashboard";
import { ActionRoute, DashboardRoute, RootRoute } from "@/routes/paths";
import { Role } from "@repo/entities";
import { Action, Resource } from "@repo/permissions";
import { lazy, Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";

const IndexPage = lazy(() => import("@/pages/dashboard/overview"));

// User
const UserListPage = lazy(() => import("@/pages/dashboard/user/list"));
const UserCreatePage = lazy(() => import("@/pages/dashboard/user/create"));
const UserEditPage = lazy(() => import("@/pages/dashboard/user/edit"));
const UserPermissionPage = lazy(
  () => import("@/pages/dashboard/user/permission")
);
const UserResetPasswordPage = lazy(
  () => import("@/pages/dashboard/user/reset-password")
);

// Patient
const PatientListPage = lazy(() => import("@/pages/dashboard/patient/list"));
const PatientCreatePage = lazy(
  () => import("@/pages/dashboard/patient/create")
);
const PatientEditPage = lazy(() => import("@/pages/dashboard/patient/edit"));
const PatientInvoicePage = lazy(
  () => import("@/pages/dashboard/patient/invoice")
);
const PatientInvoiceCreatePage = lazy(
  () => import("@/pages/dashboard/patient/invoice-create")
);
const PatientInvoiceEditPage = lazy(
  () => import("@/pages/dashboard/patient/invoice-edit")
);

// Treatment
const TreatmentListPage = lazy(
  () => import("@/pages/dashboard/treatment/list")
);
const TreatmentCreatePage = lazy(
  () => import("@/pages/dashboard/treatment/create")
);
const TreatmentEditPage = lazy(
  () => import("@/pages/dashboard/treatment/edit")
);

// Invoice
const InvoicePage = lazy(() => import("@/pages/dashboard/invoice"));

// Settings
const SettingsPage = lazy(() => import("@/pages/dashboard/settings"));

export const dashboardRoutes: RouteObject[] = [
  {
    path: RootRoute.DASHBOARD,
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<SplashScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: DashboardRoute.USER,
        element: (
          <RoleBasedGuard roles={[Role.ADMIN]}>
            <Outlet />
          </RoleBasedGuard>
        ),
        children: [
          { element: <UserListPage />, index: true },
          { path: ActionRoute.CREATE, element: <UserCreatePage /> },
          {
            path: ":id",
            children: [
              { path: ActionRoute.EDIT, element: <UserEditPage /> },
              { path: ActionRoute.PERMISSION, element: <UserPermissionPage /> },
              {
                path: ActionRoute.RESET_PASSWORD,
                element: <UserResetPasswordPage />,
              },
            ],
          },
        ],
      },
      {
        path: DashboardRoute.PATIENT,
        element: (
          <RoleBasedGuard roles={[Role.DOCTOR, Role.STAFF]}>
            <Outlet />
          </RoleBasedGuard>
        ),
        children: [
          {
            element: (
              <PermissionGuard
                resource={Resource.patient}
                actions={Action.READ}
              >
                <PatientListPage />
              </PermissionGuard>
            ),
            index: true,
          },
          {
            path: ActionRoute.CREATE,
            element: (
              <PermissionGuard
                resource={Resource.patient}
                actions={Action.CREATE}
              >
                <PatientCreatePage />
              </PermissionGuard>
            ),
          },
          {
            path: ":id",
            children: [
              {
                path: DashboardRoute.INVOICE,
                element: (
                  <RoleBasedGuard roles={[Role.DOCTOR, Role.STAFF]}>
                    <Outlet />
                  </RoleBasedGuard>
                ),
                children: [
                  {
                    index: true,
                    element: <PatientInvoicePage />,
                  },
                  {
                    path: ActionRoute.CREATE,
                    element: (
                      <PermissionGuard
                        resource={Resource.invoice}
                        actions={Action.CREATE_INVOICES}
                      >
                        <PatientInvoiceCreatePage />
                      </PermissionGuard>
                    ),
                  },
                  {
                    path: ":invoiceId",
                    children: [
                      {
                        path: ActionRoute.EDIT,
                        element: (
                          <PermissionGuard
                            resource={Resource.invoice}
                            actions={Action.UPDATE_INVOICES}
                          >
                            <PatientInvoiceEditPage />
                          </PermissionGuard>
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                path: ActionRoute.EDIT,
                element: (
                  <PermissionGuard
                    resource={Resource.patient}
                    actions={Action.UPDATE}
                  >
                    <PatientEditPage />
                  </PermissionGuard>
                ),
              },
            ],
          },
        ],
      },
      {
        path: DashboardRoute.TREATMENT,
        element: (
          <RoleBasedGuard roles={[Role.DOCTOR, Role.STAFF]}>
            <Outlet />
          </RoleBasedGuard>
        ),
        children: [
          {
            element: (
              <PermissionGuard
                resource={Resource.treatment}
                actions={Action.LIST}
              >
                <TreatmentListPage />
              </PermissionGuard>
            ),
            index: true,
          },
          {
            path: ActionRoute.CREATE,
            element: (
              <PermissionGuard
                resource={Resource.treatment}
                actions={Action.CREATE}
              >
                <TreatmentCreatePage />
              </PermissionGuard>
            ),
          },
          {
            path: ":id",
            children: [
              {
                path: ActionRoute.EDIT,
                element: (
                  <PermissionGuard
                    resource={Resource.treatment}
                    actions={Action.UPDATE}
                  >
                    <TreatmentEditPage />
                  </PermissionGuard>
                ),
              },
            ],
          },
        ],
      },
      {
        path: DashboardRoute.INVOICE,
        element: (
          <PermissionGuard resource={Resource.invoice} actions={Action.READ}>
            <InvoicePage />
          </PermissionGuard>
        ),
      },
      { path: DashboardRoute.SETTINGS, element: <SettingsPage /> },
    ],
  },
];
