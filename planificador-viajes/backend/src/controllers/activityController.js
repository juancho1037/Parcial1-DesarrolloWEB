const Activity = require("../models/Activity");
const Trip = require("../models/Trip");
const Destination = require("../models/Destination");

const activityController = {
  // Crear nueva actividad para un viaje
  async createActivity(req, res) {
    try {
      const { viaje_id } = req.params;
      const usuario_id = req.user.id;
      const {
        destino_id,
        nombre,
        descripcion,
        categoria,
        fecha_hora,
        costo,
        ubicacion,
        duracion_minutos,
      } = req.body;

      // Verificar que el viaje existe y pertenece al usuario
      const trip = await Trip.findById(viaje_id);
      if (!trip) {
        return res.status(404).json({
          status: "error",
          message: "Viaje no encontrado",
        });
      }

      if (trip.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para añadir actividades a este viaje",
        });
      }

      // Verificar que la fecha de la actividad está dentro del rango del viaje
      const activityDate = new Date(fecha_hora);
      const tripStartDate = new Date(trip.fecha_inicio);
      const tripEndDate = new Date(trip.fecha_fin);

      if (activityDate < tripStartDate || activityDate > tripEndDate) {
        return res.status(400).json({
          status: "error",
          message:
            "La fecha de la actividad debe estar dentro del rango del viaje",
        });
      }

      // Crear la actividad
      const activityId = await Activity.create({
        viaje_id,
        destino_id,
        nombre,
        descripcion,
        categoria,
        fecha_hora,
        costo,
        ubicacion,
        duracion_minutos,
      });

      const newActivity = await Activity.findById(activityId);

      res.status(201).json({
        status: "success",
        data: newActivity,
      });
    } catch (error) {
      console.error("Error al crear actividad:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear la actividad",
      });
    }
  },

  // Obtener todas las actividades de un viaje
  async getTripActivities(req, res) {
    try {
      const { viaje_id } = req.params;
      const usuario_id = req.user.id;

      // Verificar que el viaje existe y pertenece al usuario
      const trip = await Trip.findById(viaje_id);
      if (!trip) {
        return res.status(404).json({
          status: "error",
          message: "Viaje no encontrado",
        });
      }

      if (trip.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para ver las actividades de este viaje",
        });
      }

      // Obtener actividades ordenadas por fecha
      const activities = await Activity.findByTripId(viaje_id);

      // Calcular costo total de las actividades
      const totalCost = activities.reduce(
        (sum, activity) => sum + parseFloat(activity.costo || 0),
        0
      );

      res.json({
        status: "success",
        data: {
          activities,
          total_cost: totalCost,
          count: activities.length,
        },
      });
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener las actividades",
      });
    }
  },

  // Obtener detalle de una actividad específica
  async getActivityDetails(req, res) {
    try {
      const { viaje_id, actividad_id } = req.params;
      const usuario_id = req.user.id;

      // Verificar permisos
      const trip = await Trip.findById(viaje_id);
      if (!trip || trip.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para ver esta actividad",
        });
      }

      const activity = await Activity.findById(actividad_id);
      if (!activity || activity.viaje_id !== parseInt(viaje_id)) {
        return res.status(404).json({
          status: "error",
          message: "Actividad no encontrada",
        });
      }

      // Obtener información adicional del destino si existe
      let destinationInfo = null;
      if (activity.destino_id) {
        destinationInfo = await Destination.findById(activity.destino_id);
      }

      res.json({
        status: "success",
        data: {
          ...activity,
          destination: destinationInfo,
        },
      });
    } catch (error) {
      console.error("Error al obtener detalles de la actividad:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener los detalles de la actividad",
      });
    }
  },

  // Actualizar una actividad
  async updateActivity(req, res) {
    try {
      const { viaje_id, actividad_id } = req.params;
      const usuario_id = req.user.id;
      const {
        nombre,
        descripcion,
        categoria,
        fecha_hora,
        costo,
        ubicacion,
        estado,
        duracion_minutos,
      } = req.body;

      // Verificar permisos
      const trip = await Trip.findById(viaje_id);
      if (!trip || trip.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para modificar esta actividad",
        });
      }

      // Verificar que la actividad existe y pertenece al viaje
      const activity = await Activity.findById(actividad_id);
      if (!activity || activity.viaje_id !== parseInt(viaje_id)) {
        return res.status(404).json({
          status: "error",
          message: "Actividad no encontrada",
        });
      }

      // Si se modifica la fecha, verificar que está dentro del rango del viaje
      if (fecha_hora) {
        const activityDate = new Date(fecha_hora);
        const tripStartDate = new Date(trip.fecha_inicio);
        const tripEndDate = new Date(trip.fecha_fin);

        if (activityDate < tripStartDate || activityDate > tripEndDate) {
          return res.status(400).json({
            status: "error",
            message:
              "La fecha de la actividad debe estar dentro del rango del viaje",
          });
        }
      }

      // Actualizar la actividad
      await Activity.update(actividad_id, {
        nombre,
        descripcion,
        categoria,
        fecha_hora,
        costo,
        ubicacion,
        estado,
        duracion_minutos,
      });

      const updatedActivity = await Activity.findById(actividad_id);

      res.json({
        status: "success",
        data: updatedActivity,
      });
    } catch (error) {
      console.error("Error al actualizar actividad:", error);
      res.status(500).json({
        status: "error",
        message: "Error al actualizar la actividad",
      });
    }
  },

  // Eliminar una actividad
  async deleteActivity(req, res) {
    try {
      const { viaje_id, actividad_id } = req.params;
      const usuario_id = req.user.id;

      // Verificar permisos
      const trip = await Trip.findById(viaje_id);
      if (!trip || trip.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para eliminar esta actividad",
        });
      }

      // Verificar que la actividad existe y pertenece al viaje
      const activity = await Activity.findById(actividad_id);
      if (!activity || activity.viaje_id !== parseInt(viaje_id)) {
        return res.status(404).json({
          status: "error",
          message: "Actividad no encontrada",
        });
      }

      // Eliminar la actividad
      await Activity.delete(actividad_id);

      res.json({
        status: "success",
        message: "Actividad eliminada correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      res.status(500).json({
        status: "error",
        message: "Error al eliminar la actividad",
      });
    }
  },
};

module.exports = activityController;
