import DoctorService from "../services/doctorService.js";

class DoctorController {
  // Método para obtener un médico por ID
  async getDoctor(req, res) {
    try {
      const { doctorId } = req.params;
      const doctor = await DoctorService.getById(doctorId);

      if (!doctor) {
        return res.status(404).json({ message: "Médico no encontrado." });
      }

      return res.status(200).json(doctor);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener el médico.",
        error: error.message,
      });
    }
  }

  // Método para obtener citas de un médico por ID
  async getDoctorAppointments(req, res) {
    try {
      const { doctorId } = req.params;
      const appointments = await DoctorService.getAppointments(doctorId);

      if (appointments.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontraron citas para este médico." });
      }

      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las citas del médico.",
        error: error.message,
      });
    }
  }
}

// Exportar una instancia de la clase
export default new DoctorController();
