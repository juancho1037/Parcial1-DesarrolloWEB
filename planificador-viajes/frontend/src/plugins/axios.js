import axios from "axios";

// Configuración base de axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common["Accept"] = "application/json";

// Interceptor para manejar errores
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
