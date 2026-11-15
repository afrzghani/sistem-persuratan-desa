import { useCallback, useEffect, useState } from "react";

import { AuthContext } from "./auth-context.js";
import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService";
import {
  clearSession,
  getStoredUser,
  getToken,
  setSession,
} from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getToken())
  );
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    let aktif = true;

    async function muatSesi() {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getMe();

        if (aktif) {
          setUser(profile);
          setSession(token, profile);
          setIsAuthenticated(true);
        }
      } catch {
        if (aktif) {
          clearSession();
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (aktif) {
          setIsLoading(false);
        }
      }
    }

    muatSesi();

    return () => {
      aktif = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);

    setSession(data.token, data.user);
    setUser(data.user);
    setIsAuthenticated(true);

    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await getMe();
    setUser(profile);
    setSession(getToken(), profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
