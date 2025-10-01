import GuestGuard from "@/auth/guard/guest-guard";
import AuthLayoutClassic from "@/layouts/auth/classic";
import { lazy, Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import { AuthRoute, RootRoute } from "../paths";

const LoginPage = lazy(() => import("@/pages/auth/login"));

export const authRoutes: RouteObject[] = [
  {
    path: RootRoute.AUTH,
    element: (
      <GuestGuard>
        <AuthLayoutClassic>
          <Suspense>
            <Outlet />
          </Suspense>
        </AuthLayoutClassic>
      </GuestGuard>
    ),
    children: [{ path: AuthRoute.LOGIN, element: <LoginPage /> }],
  },
];
