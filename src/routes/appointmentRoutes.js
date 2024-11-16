import express from "express";
import { createAppointment } from "../controllers/appointmentController.js";
import {
  authenticateToken,
  // authorizeRole,
} from "../middlewares/authMiddleware.js";
import { validateAppointment } from "../middlewares/validationMiddleware.js";
import {
  getAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post(
  "/appointments",
  authenticateToken,
  // authorizeRole("patient"),
  validateAppointment,
  createAppointment
);

router.get(
  "/appointments",
  authenticateToken,
  // authorizeRole("admin"), // Solo administradores pueden ver todas las citas
  getAppointments
);

router.delete(
  "/appointments/:id",
  authenticateToken,
  // authorizeRole("admin"), // Solo administradores pueden cancelar citas
  cancelAppointment
);

export default router;
