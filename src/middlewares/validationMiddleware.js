import { body, validationResult } from "express-validator";

export const validateAppointment = [
  body("doctorId").isInt().withMessage("Doctor ID debe ser un número."),
  body("patientId").isInt().withMessage("Patient ID debe ser un número."),
  body("dateTime")
    .isISO8601()
    .withMessage("DateTime debe estar en formato ISO8601."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
