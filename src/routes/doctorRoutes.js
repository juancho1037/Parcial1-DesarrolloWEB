import express from "express";
import doctorController from "../controllers/doctorController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Obtener datos de un médico
router.get(
  "/:doctorId",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  (req, res) => doctorController.getDoctor(req, res)
);

// Listar citas de un médico específico
router.get(
  "/:doctorId/appointment",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  (req, res) => doctorController.getDoctorAppointments(req, res)
);

export default router;
