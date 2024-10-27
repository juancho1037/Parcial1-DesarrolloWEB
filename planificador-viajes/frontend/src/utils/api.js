import axios from "axios";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error con respuesta del servidor
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // No autorizado
          console.error("No tienes permisos para realizar esta acción");
          break;
        case 404:
          // Recurso no encontrado
          console.error("El recurso solicitado no existe");
          break;
        case 422:
          // Error de validación
          console.error("Datos inválidos:", error.response.data.errors);
          break;
        case 500:
          // Error del servidor
          console.error("Error interno del servidor");
          break;
        default:
          console.error("Error en la petición:", error.response.data);
      }
    } else if (error.request) {
      // Error sin respuesta del servidor
      console.error("No se pudo conectar con el servidor");
    } else {
      // Error en la configuración de la petición
      console.error("Error al configurar la petición:", error.message);
    }
    return Promise.reject(error);
  }
);

// Funciones de API para viajes
const tripsAPI = {
  getAll: () => api.get("/trips"),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post("/trips", data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  addActivity: (tripId, data) => api.post(`/trips/${tripId}/activities`, data),
  updateActivity: (tripId, activityId, data) =>
    api.put(`/trips/${tripId}/activities/${activityId}`, data),
  deleteActivity: (tripId, activityId) =>
    api.delete(`/trips/${tripId}/activities/${activityId}`),
};

// Funciones de API para destinos
const destinationsAPI = {
  getAll: (params) => api.get("/destinations", { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  search: (query) => api.get(`/destinations/search`, { params: { q: query } }),
  getPopular: () => api.get("/destinations/popular"),
  getByCategory: (category) => api.get(`/destinations/category/${category}`),
  getFeatured: () => api.get("/destinations/featured"),
  getReviews: (id) => api.get(`/destinations/${id}/reviews`),
  addReview: (id, data) => api.post(`/destinations/${id}/reviews`, data),
};

// Funciones de API para usuario
const userAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.post("/auth/password", data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  refreshToken: () => api.post("/auth/refresh"),
};

// Funciones de API para favoritos
const favoritesAPI = {
  getAll: () => api.get("/favorites"),
  add: (type, id) => api.post("/favorites", { type, id }),
  remove: (type, id) => api.delete(`/favorites/${type}/${id}`),
};

// Funciones de API para uploads
const uploadsAPI = {
  uploadImage: (file, type) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    return api.post("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export {
  api as default,
  tripsAPI,
  destinationsAPI,
  userAPI,
  favoritesAPI,
  uploadsAPI,
};
