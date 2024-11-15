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
