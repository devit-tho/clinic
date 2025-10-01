import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { authRoutes } from "./features/auth";
import { dashboardRoutes } from "./features/dashboard";
import { usePathname } from "./hooks";
import paths from "./paths";

// ----------------------------------------------------------------------

export default function Router() {
  const pathname = usePathname();

  useEffect(() => {
    nprogress.configure({ showSpinner: false });
    nprogress.start();
    nprogress.done();
  }, [pathname]);

  return useRoutes([
    { path: "/", element: <Navigate to={paths.dashboard.root} replace /> },
    ...authRoutes,
    ...dashboardRoutes,
  ]);
}
