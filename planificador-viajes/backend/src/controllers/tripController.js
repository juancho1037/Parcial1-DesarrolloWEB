const Trip = require("../models/Trip");
const Activity = require("../models/Activity");
const Destination = require("../models/Destination");

const tripController = {
  // Crear nuevo viaje
  async createTrip(req, res) {
    try {
      const usuario_id = req.user.id; // Del middleware de autenticación
      const { destino_id, titulo, fecha_inicio, fecha_fin, presupuesto } =
        req.body;

      // Verificar que el destino existe
      const destino = await Destination.findById(destino_id);
      if (!destino) {
        return res.status(404).json({
          status: "error",
          message: "El destino seleccionado no existe",
        });
      }

      // Validar fechas
      const fechaInicio = new Date(fecha_inicio);
      const fechaFin = new Date(fecha_fin);

      if (fechaInicio >= fechaFin) {
        return res.status(400).json({
          status: "error",
          message: "La fecha de inicio debe ser anterior a la fecha de fin",
        });
      }

      // Crear el viaje
      const tripId = await Trip.create({
        usuario_id,
        destino_id,
        titulo,
        fecha_inicio,
        fecha_fin,
        presupuesto,
      });

      const newTrip = await Trip.findById(tripId);

      res.status(201).json({
        status: "success",
        data: newTrip,
      });
    } catch (error) {
      console.error("Error al crear viaje:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear el viaje",
      });
    }
  },

  // Obtener todos los viajes del usuario
  async getUserTrips(req, res) {
    try {
      const usuario_id = req.user.id;
      const trips = await Trip.findByUserId(usuario_id);

      // Agregar información adicional a cada viaje
      const tripsWithDetails = await Promise.all(
        trips.map(async (trip) => {
          const activities = await Activity.findByTripId(trip.id);
          const totalCost = await Trip.getTotalCost(trip.id);

          return {
            ...trip,
            activities_count: activities.length,
            total_cost: totalCost,
          };
        })
      );

      res.json({
        status: "success",
        data: tripsWithDetails,
      });
    } catch (error) {
      console.error("Error al obtener viajes:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener los viajes",
      });
    }
  },

  // Obtener detalles de un viaje específico
  async getTripDetails(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;

      const trip = await Trip.findById(id);

      if (!trip) {
        return res.status(404).json({
          status: "error",
          message: "Viaje no encontrado",
        });
      }

      // Verificar que el viaje pertenece al usuario
      if (trip.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para ver este viaje",
        });
      }

      // Obtener actividades del viaje
      const activities = await Activity.findByTripId(id);
      const totalCost = await Trip.getTotalCost(id);

      // Obtener información del destino
      const destination = await Destination.findById(trip.destino_id);

      res.json({
        status: "success",
        data: {
          ...trip,
          destination,
          activities,
          total_cost: totalCost,
        },
      });
    } catch (error) {
      console.error("Error al obtener detalles del viaje:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener los detalles del viaje",
      });
    }
  },

  // Actualizar un viaje
  async updateTrip(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;
      const { titulo, fecha_inicio, fecha_fin, estado, presupuesto } = req.body;

      // Verificar que el viaje existe y pertenece al usuario
      const trip = await Trip.findById(id);
      if (!trip) {
        return res.status(404).json({
          status: "error",
          message: "Viaje no encontrado",
        });
      }

      if (trip.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para modificar este viaje",
        });
      }

      // Validar fechas si se proporcionan
      if (fecha_inicio && fecha_fin) {
        const fechaInicio = new Date(fecha_inicio);
        const fechaFin = new Date(fecha_fin);

        if (fechaInicio >= fechaFin) {
          return res.status(400).json({
            status: "error",
            message: "La fecha de inicio debe ser anterior a la fecha de fin",
          });
        }
      }

      // Actualizar el viaje
      await Trip.update(id, {
        titulo,
        fecha_inicio,
        fecha_fin,
        estado,
        presupuesto,
      });

      const updatedTrip = await Trip.findById(id);

      res.json({
        status: "success",
        data: updatedTrip,
      });
    } catch (error) {
      console.error("Error al actualizar viaje:", error);
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el viaje",
      });
    }
  },

  // Eliminar un viaje
  async deleteTrip(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;

      // Verificar que el viaje existe y pertenece al usuario
      const trip = await Trip.findById(id);
      if (!trip) {
        return res.status(404).json({
          status: "error",
          message: "Viaje no encontrado",
        });
      }

      if (trip.usuario_id !== usuario_id) {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para eliminar este viaje",
        });
      }

      // Eliminar el viaje y sus actividades asociadas
      await Trip.delete(id);

      res.json({
        status: "success",
        message: "Viaje eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar viaje:", error);
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el viaje",
      });
    }
  },
};

module.exports = tripController;
