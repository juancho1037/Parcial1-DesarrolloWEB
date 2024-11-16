import Appointment from "../models/appointments.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, dateTime } = req.body;

    // Validar conflictos
    const doctorConflict = await Appointment.getAppointmentByDoctorAndDate(
      doctorId,
      dateTime
    );
    if (doctorConflict) {
      return res
        .status(400)
        .json({ message: "El médico ya tiene una cita en esta fecha y hora." });
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
    return res.status(500).json({ message: "Error al crear la cita.", error });
  }
};

//metodo para listar citas.
export const getAppointments = async (req, res) => {
  try {
    const query = "SELECT * FROM appointments;";
    const result = await pool.query(query);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener las citas.", error });
  }
};

// metodo para cancelar citas.
export const cancelAppointment = async (req, res) => {
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
};
