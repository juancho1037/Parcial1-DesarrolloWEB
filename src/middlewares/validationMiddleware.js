import { body, validationResult } from "express-validator";

class ValidationMiddleware {
  // Método para validar citas
  validateAppointment(requirePatientId = true) {
    const validations = [
      body("doctorId").isInt().withMessage("Doctor ID debe ser un número."),
      body("dateTime")
        .isISO8601()
        .withMessage("DateTime debe estar en formato ISO8601."),
    ];

    if (requirePatientId) {
      validations.push(
        body("patientId").isInt().withMessage("Patient ID debe ser un número.")
      );
    }

    return [
      ...validations,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    ];
  }
}

// Exportar una instancia de la clase
export default new ValidationMiddleware();
