const Review = require("../models/Review");
const Trip = require("../models/Trip");
const Activity = require("../models/Activity");
const Destination = require("../models/Destination");

const reviewController = {
  // Crear nueva reseña
  async createReview(req, res) {
    try {
      const usuario_id = req.user.id;
      const { destino_id, actividad_id, calificacion, comentario } = req.body;

      // Validar que se proporcione al menos un destino o actividad
      if (!destino_id && !actividad_id) {
        return res.status(400).json({
          status: "error",
          message:
            "Debe proporcionar un destino o una actividad para la reseña",
        });
      }

      // Validar calificación
      if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({
          status: "error",
          message: "La calificación debe estar entre 1 y 5",
        });
      }

      // Si es para un destino, verificar que existe
      if (destino_id) {
        const destination = await Destination.findById(destino_id);
        if (!destination) {
          return res.status(404).json({
            status: "error",
            message: "Destino no encontrado",
          });
        }
      }

      // Si es para una actividad, verificar que existe y que el usuario participó en ella
      if (actividad_id) {
        const activity = await Activity.findById(actividad_id);
        if (!activity) {
          return res.status(404).json({
            status: "error",
            message: "Actividad no encontrada",
          });
        }

        const trip = await Trip.findById(activity.viaje_id);
        if (trip.usuario_id !== usuario_id) {
          return res.status(403).json({
            status: "error",
            message:
              "Solo puedes reseñar actividades en las que hayas participado",
          });
        }
      }

      const reviewId = await Review.create({
        usuario_id,
        destino_id,
        actividad_id,
        calificacion,
        comentario,
      });

      const newReview = await Review.findById(reviewId);

      res.status(201).json({
        status: "success",
        data: newReview,
      });
    } catch (error) {
      console.error("Error al crear reseña:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear la reseña",
      });
    }
  },

  // Obtener reseñas de un usuario
  async getUserReviews(req, res) {
    try {
      const usuario_id = req.user.id;
      const reviews = await Review.findByUser(usuario_id);

      res.json({
        status: "success",
        data: reviews,
      });
    } catch (error) {
      console.error("Error al obtener reseñas del usuario:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener las reseñas",
      });
    }
  },

  // Obtener reseñas de un destino
  async getDestinationReviews(req, res) {
    try {
      const { destino_id } = req.params;
      const reviews = await Review.findByDestination(destino_id);

      const averageRating = await Review.getAverageRating(destino_id);

      res.json({
        status: "success",
        data: {
          reviews,
          average_rating: averageRating,
          total_reviews: reviews.length,
        },
      });
    } catch (error) {
      console.error("Error al obtener reseñas del destino:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener las reseñas",
      });
    }
  },

  // Obtener reseñas de una actividad
  async getActivityReviews(req, res) {
    try {
      const { actividad_id } = req.params;
      const reviews = await Review.findByActivity(actividad_id);

      const averageRating = await Review.getAverageRating(null, actividad_id);

      res.json({
        status: "success",
        data: {
          reviews,
          average_rating: averageRating,
          total_reviews: reviews.length,
        },
      });
    } catch (error) {
      console.error("Error al obtener reseñas de la actividad:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener las reseñas",
      });
    }
  },

  // Actualizar una reseña (continuación)
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;
      const { calificacion, comentario } = req.body;

      // Verificar que la reseña existe y pertenece al usuario
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({
          status: "error",
          message: "Reseña no encontrada",
        });
      }

      if (review.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para modificar esta reseña",
        });
      }

      // Validar calificación
      if (calificacion && (calificacion < 1 || calificacion > 5)) {
        return res.status(400).json({
          status: "error",
          message: "La calificación debe estar entre 1 y 5",
        });
      }

      await Review.update(id, { calificacion, comentario });

      const updatedReview = await Review.findById(id);

      res.json({
        status: "success",
        data: updatedReview,
      });
    } catch (error) {
      console.error("Error al actualizar reseña:", error);
      res.status(500).json({
        status: "error",
        message: "Error al actualizar la reseña",
      });
    }
  },

  // Eliminar una reseña
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;

      // Verificar que la reseña existe y pertenece al usuario
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({
          status: "error",
          message: "Reseña no encontrada",
        });
      }

      if (review.usuario_id !== usuario_id && !req.user.isAdmin) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para eliminar esta reseña",
        });
      }

      await Review.delete(id);

      res.json({
        status: "success",
        message: "Reseña eliminada correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar reseña:", error);
      res.status(500).json({
        status: "error",
        message: "Error al eliminar la reseña",
      });
    }
  },

  // Aprobar una reseña (solo admin)
  async approveReview(req, res) {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para aprobar reseñas",
        });
      }

      const { id } = req.params;
      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({
          status: "error",
          message: "Reseña no encontrada",
        });
      }

      await Review.approve(id);

      res.json({
        status: "success",
        message: "Reseña aprobada correctamente",
      });
    } catch (error) {
      console.error("Error al aprobar reseña:", error);
      res.status(500).json({
        status: "error",
        message: "Error al aprobar la reseña",
      });
    }
  },

  // Obtener reseñas pendientes de aprobación (solo admin)
  async getPendingReviews(req, res) {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para ver reseñas pendientes",
        });
      }

      const pendingReviews = await Review.findPendingReviews();

      res.json({
        status: "success",
        data: pendingReviews,
      });
    } catch (error) {
      console.error("Error al obtener reseñas pendientes:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener las reseñas pendientes",
      });
    }
  },
};

module.exports = reviewController;
