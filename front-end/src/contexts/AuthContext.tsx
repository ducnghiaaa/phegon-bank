import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiService, Role } from "../services/apiService";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  roles: Role[];
  isAdmin: boolean;
  isCustomer: boolean;
  isAuditor: boolean;
  login: (token: string, roles?: Role[]) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<Role[]>([]);

  // Check auth state on mount and when storage changes
  const checkAuthState = () => {
    const token = apiService.getToken();
    const userRoles = apiService.getRoles();
    setIsAuthenticated(!!token);
    setRoles(userRoles);
    setLoading(false);
  };

  useEffect(() => {
    // Check initial auth state
    checkAuthState();

    // Listen to storage changes (when login/logout happens in other tabs or components)
    const handleStorageChange = () => {
      checkAuthState();
    };

    if (globalThis.window !== undefined) {
      globalThis.window.addEventListener("storage", handleStorageChange);
    }

    // Also check periodically to catch changes in the same tab
    const interval = setInterval(checkAuthState, 1000);

    return () => {
      if (globalThis.window !== undefined) {
        globalThis.window.removeEventListener("storage", handleStorageChange);
      }
      clearInterval(interval);
    };
  }, []);

  const login = (token: string, roles?: Role[]): void => {
    if (roles) {
      apiService.saveAuthData(token, roles);
      setRoles(roles);
    } else {
      apiService.saveAuthData(token, []);
      setRoles([]);
    }
    setIsAuthenticated(true);
    // Trigger check to ensure state is synced
    checkAuthState();
  };

  const logout = (): void => {
    apiService.logout();
    setIsAuthenticated(false);
    setRoles([]);
  };

  const hasRole = (role: Role): boolean => {
    return apiService.hasRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        roles,
        isAdmin: apiService.isAdmin(),
        isCustomer: apiService.isCustomer(),
        isAuditor: apiService.isAuditor(),
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

