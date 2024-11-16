import express from "express";
import patientController from "../controllers/patientController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Inicio de sesión del paciente
router.post("/login", (req, res) => patientController.loginPatient(req, res));

// Manejo de citas del paciente
router.get(
  "/appointment",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  (req, res) => patientController.getPatientAppointments(req, res)
);

router.post(
  "/appointment",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  ...validationMiddleware.validateAppointment(),
  (req, res) => patientController.createAppointment(req, res)
);

router.put(
  "/appointment/:appointmentId",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  ...validationMiddleware.validateAppointment(),
  (req, res) => patientController.updateAppointment(req, res)
);

router.delete(
  "/appointment/:appointmentId",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  (req, res) => patientController.deleteAppointment(req, res)
);

export default router;
