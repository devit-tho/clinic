import { useRouter } from "@/routes/hooks";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

// routes
import paths from "@/routes/paths";
import { useAuth } from "../hooks";
//

const loginPaths: Record<string, string> = {
  jwt: paths.auth.login,
};

const AuthGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const { authenticated, method } = useAuth();

  const [checked, setChecked] = useState<boolean>(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];

      const href = `/${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, router, method]);

  useEffect(() => {
    check();
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
