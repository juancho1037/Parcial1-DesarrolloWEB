import JWT from "../config/jwt.js";
import PatientService from "../services/patientService.js";
import AppointmentService from "../services/appointmentService.js";

class PatientController {
  // Método para iniciar sesión
  async loginPatient(req, res) {
    const { email, password } = req.body;

    try {
      const patient = await PatientService.authenticate(email, password);
      if (!patient) {
        return res.status(401).json({ message: "Credenciales inválidas." });
      }

      const token = JWT.generateToken(
        { id: patient.id, role: "patient" },
        "30m"
      );
      return res.status(200).json({ token });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al iniciar sesión.", error });
    }
  }

  // Método para obtener citas del paciente
  async getPatientAppointments(req, res) {
    const { id } = req.user;
    const { date } = req.query;

    try {
      const appointments = await AppointmentService.getByPatient(id, date);
      return res.status(200).json(appointments);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener citas.", error });
    }
  }

  // Método para crear una cita
  async createAppointment(req, res) {
    const { id } = req.user;
    const { doctorId, dateTime } = req.body;

    try {
      const newAppointment = await AppointmentService.create(
        id,
        doctorId,
        dateTime
      );
      return res.status(201).json(newAppointment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Método para actualizar una cita
  async updateAppointment(req, res) {
    const { id } = req.user;
    const { appointmentId } = req.params;
    const { doctorId, dateTime } = req.body;

    try {
      const updatedAppointment = await AppointmentService.update(
        id,
        appointmentId,
        doctorId,
        dateTime
      );
      return res.status(200).json(updatedAppointment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Método para eliminar una cita
  async deleteAppointment(req, res) {
    const { id } = req.user;
    const { appointmentId } = req.params;

    try {
      await AppointmentService.delete(id, appointmentId);
      return res.status(200).json({ message: "Cita eliminada correctamente." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

// Exportar una instancia de la clase
export default new PatientController();
