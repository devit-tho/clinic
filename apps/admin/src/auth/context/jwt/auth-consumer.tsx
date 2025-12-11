import { PropsWithChildren } from "react";

import { SplashScreen } from "@/components/loading";

import { AuthContext, AuthProviderProps } from "./auth-context";

const AuthConsumer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthContext.Consumer>
      {(auth: AuthProviderProps | undefined) =>
        auth?.loading ? <SplashScreen /> : children
      }
    </AuthContext.Consumer>
  );
};

export { AuthConsumer };
