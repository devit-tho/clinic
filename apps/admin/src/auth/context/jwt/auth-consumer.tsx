import { PropsWithChildren } from "react";

import { LoadingScreen } from "@/components/loading";

import { AuthContext, AuthProviderProps } from "./auth-context";

const AuthConsumer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthContext.Consumer>
      {(auth: AuthProviderProps | undefined) =>
        auth?.loading ? <LoadingScreen /> : children
      }
    </AuthContext.Consumer>
  );
};

export { AuthConsumer };
