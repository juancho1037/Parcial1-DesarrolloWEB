const constants = {
  // Estados de viaje
  TRIP_STATUS: {
    PLANNED: "PLANIFICADO",
    IN_PROGRESS: "EN_CURSO",
    COMPLETED: "COMPLETADO",
    CANCELLED: "CANCELADO",
  },

  // Categorías de actividades
  ACTIVITY_CATEGORIES: {
    TOURISM: "TURISMO",
    GASTRONOMY: "GASTRONOMIA",
    CULTURE: "CULTURA",
    ADVENTURE: "AVENTURA",
    RELAXATION: "RELAX",
    SHOPPING: "COMPRAS",
    ENTERTAINMENT: "ENTRETENIMIENTO",
    SPORTS: "DEPORTES",
  },

  // Estados de actividades
  ACTIVITY_STATUS: {
    PENDING: "PENDIENTE",
    CONFIRMED: "CONFIRMADA",
    COMPLETED: "COMPLETADA",
    CANCELLED: "CANCELADA",
  },

  // Límites y configuraciones
  LIMITS: {
    MAX_TRIP_DURATION_DAYS: 30,
    MIN_TRIP_DURATION_DAYS: 1,
    MAX_ACTIVITIES_PER_DAY: 10,
    MAX_DESCRIPTION_LENGTH: 1000,
    MIN_REVIEW_LENGTH: 10,
    MAX_REVIEW_LENGTH: 500,
  },

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },

  // Tipos de clima
  WEATHER_TYPES: {
    SUNNY: "SOLEADO",
    RAINY: "LLUVIOSO",
    CLOUDY: "NUBLADO",
    SNOWY: "NEVADO",
    WINDY: "VENTOSO",
    TROPICAL: "TROPICAL",
  },

  // Roles de usuario
  USER_ROLES: {
    ADMIN: "ADMIN",
    USER: "USER",
  },
};

module.exports = constants;
