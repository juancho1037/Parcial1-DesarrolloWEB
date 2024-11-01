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
        // Llamada a la API del servidor
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/login`,
          credentials
        );

        const { token, user } = response.data.data;

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
          `${import.meta.env.VITE_API_URL}/register`,
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

    async checkAuth() {
      if (!this.token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.user = response.data.data;
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        this.logout();
      }
    },

    // Cerrar sesión
    async logout() {
      const appStore = useAppStore();

      try {
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];

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

    // Actualizar perfil
    async updateProfile(userData) {
      const appStore = useAppStore();
      this.loading = true;

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/profile`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        this.user = response.data.data;
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

    // Solicitar restablecimiento de contraseña
    async requestPasswordReset(email) {
      const appStore = useAppStore();
      this.loading = true;

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password`, {
          email,
        });

        appStore.showSnackbar({
          text: "Se han enviado las instrucciones a tu correo",
          color: "success",
        });
      } catch (error) {
        console.error(
          "Error al solicitar restablecimiento de contraseña:",
          error
        );
        appStore.showSnackbar({
          text:
            error.response?.data?.message ||
            "Error al solicitar restablecimiento",
          color: "error",
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Restablecer contraseña
    async resetPassword({ token, password }) {
      const appStore = useAppStore();
      this.loading = true;

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
          token,
          password,
        });

        appStore.showSnackbar({
          text: "Contraseña restablecida correctamente",
          color: "success",
        });

        router.push("/login");
      } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        appStore.showSnackbar({
          text:
            error.response?.data?.message || "Error al restablecer contraseña",
          color: "error",
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Verificar sesión
    async checkSession() {
      if (!this.token) return false;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        this.user = response.data.data;
        return true;
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        this.logout();
        return false;
      }
    },
  },
});
