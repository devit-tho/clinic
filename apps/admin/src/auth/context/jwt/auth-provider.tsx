import NProgress from "nprogress";
import { PropsWithChildren, useEffect, useMemo, useReducer } from "react";

// Context
import { AuthContext } from "./auth-context";

// Service
import {
  getCurrentUser,
  getDevice,
  login as loginApi,
  logout as logoutApi,
} from "@/api";

// Helpers
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { UserWithoutPassword } from "@repo/entities";
import { isValidToken, setSession } from "./utils";

// -----------------------------------------------------------------------------------

enum USER {
  LOADING = "LOADING",
  LOADED = "LOADED",
  INITIALIZE = "INITIAL",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

interface initialUserReducer {
  user: UserWithoutPassword | null;
  loading: boolean;
}

type ReducerAction = {
  type: USER;
  payload?: {
    user: null | UserWithoutPassword;
  };
};

const initialState: initialUserReducer = {
  user: null,
  loading: true,
};

const reducer = (
  state: initialUserReducer,
  action: ReducerAction
): initialUserReducer => {
  if (action.type === USER.INITIALIZE) {
    return {
      loading: false,
      user: action.payload?.user as UserWithoutPassword,
    };
  }

  if (action.type === USER.LOGIN) {
    return {
      ...state,
      user: action.payload?.user as UserWithoutPassword,
      loading: false,
    };
  }

  if (action.type === USER.LOGOUT) {
    return {
      ...state,
      user: null,
      loading: true,
    };
  }

  if (action.type === USER.LOADED) {
    return { ...state, loading: false };
  }

  return state;
};

const STORAGE_KEY = "token";

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { push } = useRouter();
  const [{ user, loading }, dispatch] = useReducer(reducer, initialState);

  const initialize = async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const { data } = await getCurrentUser();

        dispatch({
          type: USER.INITIALIZE,
          payload: {
            user: data as UserWithoutPassword,
          },
        });
      } else {
        dispatch({
          type: USER.INITIALIZE,
          payload: {
            user: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: USER.INITIALIZE,
        payload: {
          user: null,
        },
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const login = async (username: string, password: string) => {
    dispatch({ type: USER.LOADING });
    const device = getDevice();
    const { data } = await loginApi({ username, password, device });
    setSession(data.token);

    dispatch({ type: USER.LOGIN, payload: { user: data.user } });

    dispatch({ type: USER.LOADED });
  };

  const logout = async () => {
    dispatch({ type: USER.LOGOUT });
    await logoutApi();
    NProgress.start();
    setSession(null);
    push(paths.auth.login);
    dispatch({ type: USER.LOADED });
  };

  const checkAuthenticated = user ? "authenticated" : "unauthenciated";

  const status = loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenciated",
      login,
      logout,
    }),
    [login, logout, user, loading, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
};

export { AuthProvider };
