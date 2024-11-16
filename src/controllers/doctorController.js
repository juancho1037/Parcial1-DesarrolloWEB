import DoctorService from "../services/doctorService.js";

export const getDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await DoctorService.getById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Médico no encontrado." });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el médico.", error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
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
};
