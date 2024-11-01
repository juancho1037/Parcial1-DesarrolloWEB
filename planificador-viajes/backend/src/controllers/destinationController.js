const Destination = require("../models/Destination");
const Review = require("../models/Review");
const Activity = require("../models/Activity");

const destinationController = {
  // Obtener todos los destinos con filtros
  async getDestinations(req, res) {
    try {
      const { pais, ciudad, calificacion_minima } = req.query;

      const destinations = await Destination.search({
        pais,
        ciudad,
        calificacion_minima: calificacion_minima
          ? parseFloat(calificacion_minima)
          : null,
      });

      // Enriquecer cada destino con información adicional
      const enrichedDestinations = await Promise.all(
        destinations.map(async (destination) => {
          const reviews = await Review.findByDestination(destination.id);
          const activities = await Activity.findByDestination(destination.id);

          return {
            ...destination,
            review_count: reviews.length,
            activity_count: activities.length,
            recent_reviews: reviews.slice(0, 3), // Últimas 3 reseñas
          };
        })
      );

      res.json({
        status: "success",
        data: enrichedDestinations,
      });
    } catch (error) {
      console.error("Error al obtener destinos:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener los destinos",
      });
    }
  },

  // Obtener detalles de un destino específico
  async getDestinationDetails(req, res) {
    try {
      const { id } = req.params;

      const destination = await Destination.findById(id);
      if (!destination) {
        return res.status(404).json({
          status: "error",
          message: "Destino no encontrado",
        });
      }

      // Obtener reseñas del destino
      const reviews = await Review.findByDestination(id);
      const averageRating = await Review.getAverageRating(id);

      // Obtener actividades populares
      const activities = await Activity.findByDestination(id);

      // Organizar actividades por categoría
      const activitiesByCategory = activities.reduce((acc, activity) => {
        if (!acc[activity.categoria]) {
          acc[activity.categoria] = [];
        }
        acc[activity.categoria].push(activity);
        return acc;
      }, {});

      res.json({
        status: "success",
        data: {
          ...destination,
          average_rating: averageRating,
          review_count: reviews.length,
          recent_reviews: reviews.slice(0, 5), // Últimas 5 reseñas
          activities_by_category: activitiesByCategory,
        },
      });
    } catch (error) {
      console.error("Error al obtener detalles del destino:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener los detalles del destino",
      });
    }
  },

  // Crear nuevo destino (solo admin)
  async createDestination(req, res) {
    try {
      // Verificar si el usuario es administrador
      if (!req.user.isAdmin) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para crear destinos",
        });
      }

      const {
        nombre,
        pais,
        ciudad,
        descripcion,
        clima,
        moneda,
        zona_horaria,
        idioma_principal,
        imagen_url,
      } = req.body;

      // Validar datos requeridos
      if (!nombre || !pais || !ciudad) {
        return res.status(400).json({
          status: "error",
          message: "Nombre, país y ciudad son campos requeridos",
        });
      }

      const destinationId = await Destination.create({
        nombre,
        pais,
        ciudad,
        descripcion,
        clima,
        moneda,
        zona_horaria,
        idioma_principal,
        imagen_url,
      });

      const newDestination = await Destination.findById(destinationId);

      res.status(201).json({
        status: "success",
        data: newDestination,
      });
    } catch (error) {
      console.error("Error al crear destino:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear el destino",
      });
    }
  },

  // Actualizar destino (solo admin)
  async updateDestination(req, res) {
    try {
      // Verificar si el usuario es administrador
      if (!req.user.isAdmin) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para actualizar destinos",
        });
      }

      const { id } = req.params;
      const {
        nombre,
        descripcion,
        clima,
        moneda,
        zona_horaria,
        idioma_principal,
        imagen_url,
      } = req.body;

      const destination = await Destination.findById(id);
      if (!destination) {
        return res.status(404).json({
          status: "error",
          message: "Destino no encontrado",
        });
      }

      await Destination.update(id, {
        nombre,
        descripcion,
        clima,
        moneda,
        zona_horaria,
        idioma_principal,
        imagen_url,
      });

      const updatedDestination = await Destination.findById(id);

      res.json({
        status: "success",
        data: updatedDestination,
      });
    } catch (error) {
      console.error("Error al actualizar destino:", error);
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el destino",
      });
    }
  },

  // Búsqueda de destinos
  async searchDestinations(req, res) {
    try {
      const { query, filters } = req.query;

      let searchParams = {};

      // Procesar filtros
      if (filters) {
        const parsedFilters = JSON.parse(filters);
        if (parsedFilters.pais) searchParams.pais = parsedFilters.pais;
        if (parsedFilters.ciudad) searchParams.ciudad = parsedFilters.ciudad;
        if (parsedFilters.calificacion_minima) {
          searchParams.calificacion_minima = parseFloat(
            parsedFilters.calificacion_minima
          );
        }
      }

      // Si hay un query de búsqueda, buscar en nombre, país y ciudad
      if (query) {
        searchParams = {
          ...searchParams,
          query: query.toLowerCase(),
        };
      }

      const destinations = await Destination.search(searchParams);

      // Enriquecer resultados con calificaciones promedio
      const enrichedResults = await Promise.all(
        destinations.map(async (dest) => {
          const averageRating = await Review.getAverageRating(dest.id);
          return {
            ...dest,
            calificacion_promedio: averageRating,
          };
        })
      );

      res.json({
        status: "success",
        data: enrichedResults,
      });
    } catch (error) {
      console.error("Error en búsqueda de destinos:", error);
      res.status(500).json({
        status: "error",
        message: "Error al buscar destinos",
      });
    }
  },

  // Obtener destinos populares
  async getPopularDestinations(req, res) {
    try {
      const destinations = await Destination.findAll();

      // Enriquecer con calificaciones y ordenar por popularidad
      const enrichedDestinations = await Promise.all(
        destinations.map(async (dest) => {
          const reviews = await Review.findByDestination(dest.id);
          const averageRating = await Review.getAverageRating(dest.id);
          return {
            ...dest,
            review_count: reviews.length,
            average_rating: averageRating,
          };
        })
      );

      // Ordenar por calificación promedio y número de reseñas
      const popularDestinations = enrichedDestinations
        .sort((a, b) => {
          const scoreA = a.average_rating * 0.7 + a.review_count * 0.3;
          const scoreB = b.average_rating * 0.7 + b.review_count * 0.3;
          return scoreB - scoreA;
        })
        .slice(0, 10); // Obtener los 10 más populares

      res.json({
        status: "success",
        data: popularDestinations,
      });
    } catch (error) {
      console.error("Error al obtener destinos populares:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener los destinos populares",
      });
    }
  },
};

module.exports = destinationController;
