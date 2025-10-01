import { PropsWithChildren, useCallback, useEffect } from "react";
// routes
import { useRouter, useSearchParams } from "@/routes/hooks";
import paths from "@/routes/paths";
// context
import { useAuth } from "../hooks";
// props

const GuestGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get("returnTo") || paths.dashboard.root;

  const { authenticated } = useAuth();

  const check = useCallback(() => {
    if (authenticated) {
      router.replace(returnTo);
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
};

export default GuestGuard;
