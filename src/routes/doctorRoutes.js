import express from "express";
import {
  getDoctor,
  getDoctorAppointments,
} from "../controllers/doctorController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Obtener datos de un médico
router.get("/:doctorId", authenticateToken, getDoctor);

// Listar citas de un médico específico
router.get("/:doctorId/appointment", authenticateToken, getDoctorAppointments);

export default router;
