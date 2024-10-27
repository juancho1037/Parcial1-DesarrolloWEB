import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";
import { useAppStore } from "../modules/app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userInitials: (state) => {
      if (!state.user?.name) return "";
      return state.user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    },
  },

  actions: {
    async login(credentials) {
      const appStore = useAppStore();
      this.loading = true;

      try {
        // Aquí irá la llamada real a tu API
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/login`,
          credentials
        );

        const { token, user } = response.data;

        // Guardar token y datos de usuario
        this.token = token;
        this.user = user;
        localStorage.setItem("token", token);

        // Configurar token en axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        appStore.showSnackbar({
          text: "¡Bienvenido de nuevo!",
          color: "success",
        });

        // Redireccionar según query param o a home
        const redirectPath = router.currentRoute.value.query.redirect || "/";
        router.push(redirectPath);
      } catch (error) {
        console.error("Error de login:", error);
        appStore.showSnackbar({
          text: error.response?.data?.message || "Error al iniciar sesión",
          color: "error",
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      const appStore = useAppStore();
      this.loading = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/register`,
          userData
        );

        appStore.showSnackbar({
          text: "¡Registro exitoso! Por favor, inicia sesión.",
          color: "success",
        });

        router.push("/login");
      } catch (error) {
        console.error("Error de registro:", error);
        appStore.showSnackbar({
          text: error.response?.data?.message || "Error en el registro",
          color: "error",
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const appStore = useAppStore();

      try {
        // Limpiar estado
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];

        // Redireccionar a login
        router.push("/login");

        appStore.showSnackbar({
          text: "Has cerrado sesión exitosamente",
          color: "success",
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        appStore.showSnackbar({
          text: "Error al cerrar sesión",
          color: "error",
        });
      }
    },

    async checkAuth() {
      if (!this.token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify`
        );
        this.user = response.data.user;
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        this.logout();
      }
    },

    async updateProfile(userData) {
      const appStore = useAppStore();
      this.loading = true;

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/users/profile`,
          userData
        );

        this.user = response.data;
        appStore.showSnackbar({
          text: "Perfil actualizado correctamente",
          color: "success",
        });
      } catch (error) {
        console.error("Error al actualizar perfil:", error);
        appStore.showSnackbar({
          text: error.response?.data?.message || "Error al actualizar perfil",
          color: "error",
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async requestPasswordReset(email) {
      const appStore = useAppStore();

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
          { email }
        );
      } catch (error) {
        console.error(
          "Error al solicitar restablecimiento de contraseña:",
          error
        );
        throw error;
      }
    },

    async resetPassword({ token, password }) {
      const appStore = useAppStore();

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/reset-password`,
          { token, password }
        );
      } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        throw error;
      }
    },

    // Persistencia de sesión
    async checkSession() {
      if (!this.token) return false;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/check-session`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        this.user = response.data.user;
        return true;
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        this.logout();
        return false;
      }
    },
  },
});
