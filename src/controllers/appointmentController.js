import Appointment from "../models/appointments.js";
import pool from "../config/database.js";

class AppointmentController {
  // Método para crear una cita
  async createAppointment(req, res) {
    try {
      const { doctorId, patientId, dateTime } = req.body;

      // Validar conflictos
      const doctorConflict = await Appointment.getAppointmentByDoctorAndDate(
        doctorId,
        dateTime
      );
      if (doctorConflict) {
        return res.status(400).json({
          message: "El médico ya tiene una cita en esta fecha y hora.",
        });
      }

      const patientConflict = await Appointment.getAppointmentByPatientAndDate(
        patientId,
        dateTime
      );
      if (patientConflict) {
        return res.status(400).json({
          message: "El paciente ya tiene una cita en esta fecha y hora.",
        });
      }

      const newAppointment = await Appointment.createAppointment({
        doctorId,
        patientId,
        dateTime,
      });
      return res.status(201).json(newAppointment);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al crear la cita.", error });
    }
  }

  // Método para listar citas
  async getAppointments(req, res) {
    try {
      const query = "SELECT * FROM appointments;";
      const result = await pool.query(query);
      return res.status(200).json(result.rows);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener las citas.", error });
    }
  }

  // Método para cancelar citas
  async cancelAppointment(req, res) {
    try {
      const { id } = req.params;

      const query = `
        DELETE FROM appointments
        WHERE id = $1
        RETURNING *;
      `;
      const result = await pool.query(query, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Cita no encontrada." });
      }

      return res
        .status(200)
        .json({ message: "Cita cancelada.", appointment: result.rows[0] });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al cancelar la cita.", error });
    }
  }

  async updateAppointment(req, res) {
    try {
      const { id } = req.params; // ID de la cita a actualizar
      const { doctorId, dateTime } = req.body; // Nuevos valores

      // Validar conflictos de horario para el nuevo médico y fecha
      const doctorConflict = await Appointment.getAppointmentByDoctorAndDate(
        doctorId,
        dateTime
      );

      if (doctorConflict && doctorConflict.id !== parseInt(id)) {
        return res.status(400).json({
          message: "El médico ya tiene una cita en esta fecha y hora.",
        });
      }

      // Actualizar la cita
      const query = `
        UPDATE appointments
        SET doctor_id = $1, date_time = $2
        WHERE id = $3
        RETURNING *;
      `;

      const result = await pool.query(query, [doctorId, dateTime, id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Cita no encontrada." });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar la cita.",
        error: error.message,
      });
    }
  }
}

// Exportar una instancia de la clase para usarla directamente
export default new AppointmentController();
