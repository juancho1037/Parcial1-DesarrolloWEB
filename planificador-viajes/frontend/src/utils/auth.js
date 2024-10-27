import jwtDecode from "jwt-decode";

// Gestión del token JWT
const tokenUtils = {
  setToken(token) {
    localStorage.setItem("token", token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  removeToken() {
    localStorage.removeItem("token");
  },

  isValid() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },

  getDecodedToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  },

  getUserId() {
    const decoded = this.getDecodedToken();
    return decoded ? decoded.sub : null;
  },
};

// Gestión de permisos
const permissionUtils = {
  hasPermission(permission) {
    const decoded = tokenUtils.getDecodedToken();
    if (!decoded || !decoded.permissions) return false;
    return decoded.permissions.includes(permission);
  },

  hasRole(role) {
    const decoded = tokenUtils.getDecodedToken();
    if (!decoded || !decoded.roles) return false;
    return decoded.roles.includes(role);
  },

  canAccess(resource, action) {
    return this.hasPermission(`${resource}:${action}`);
  },
};

// Gestión de sesión
const sessionUtils = {
  isAuthenticated() {
    return tokenUtils.isValid();
  },

  getSessionData() {
    const decoded = tokenUtils.getDecodedToken();
    if (!decoded) return null;

    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
    };
  },

  startSession(token, rememberMe = false) {
    tokenUtils.setToken(token);
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    }
  },

  endSession() {
    tokenUtils.removeToken();
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("lastRoute");
  },

  saveLastRoute(route) {
    if (route.name !== "Login" && route.name !== "Register") {
      localStorage.setItem(
        "lastRoute",
        JSON.stringify({
          name: route.name,
          params: route.params,
          query: route.query,
        })
      );
    }
  },

  getLastRoute() {
    const route = localStorage.getItem("lastRoute");
    return route ? JSON.parse(route) : null;
  },
};

export { tokenUtils, permissionUtils, sessionUtils };
