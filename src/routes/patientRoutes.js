import express from "express";
import {
  loginPatient,
  getPatientAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/patientController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateAppointment } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Inicio de sesión del paciente
router.post("/login", loginPatient);

// Manejo de citas del paciente
router.get("/appointment", authenticateToken, getPatientAppointments);
router.post(
  "/appointment",
  authenticateToken,
  validateAppointment,
  createAppointment
);
router.put(
  "/appointment/:appointmentId",
  authenticateToken,
  validateAppointment,
  updateAppointment
);
router.delete(
  "/appointment/:appointmentId",
  authenticateToken,
  deleteAppointment
);

export default router;
