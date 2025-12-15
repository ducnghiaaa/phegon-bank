export type Role = "ADMIN" | "CUSTOMER" | "AUDITOR";

export const apiService = {
  saveAuthData: (token: string, roles: Role[]) => {
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
  },

  hasRole: (role: Role): boolean => {
    const rolesStr = localStorage.getItem("roles");
    if (!rolesStr) return false;
    try {
      const roles = JSON.parse(rolesStr) as Role[];
      return roles.includes(role);
    } catch {
      return false;
    }
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem("token") !== null;
  },

  // Check if the user is an admin
  isAdmin: (): boolean => {
    return apiService.hasRole("ADMIN");
  },

  // Check if the user is a customer
  isCustomer: (): boolean => {
    return apiService.hasRole("CUSTOMER");
  },

  // Check if the user is an Auditor
  isAuditor: (): boolean => {
    return apiService.hasRole("AUDITOR");
  },

  getRoles: (): Role[] => {
    const rolesStr = localStorage.getItem("roles");
    if (!rolesStr) return [];
    try {
      return JSON.parse(rolesStr) as Role[];
    } catch {
      return [];
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
};

