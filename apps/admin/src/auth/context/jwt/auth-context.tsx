import { UserWithoutPassword } from "@repo/entities";
import { createContext } from "react";

export interface AuthProviderProps {
  user: UserWithoutPassword | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  method: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthProviderProps | undefined>(undefined);

export { AuthContext };
