import express from "express";
import appointmentController from "../controllers/appointmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post(
  "/",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  ...validationMiddleware.validateAppointment(),
  (req, res) => appointmentController.createAppointment(req, res)
);

router.get(
  "/",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  (req, res) => appointmentController.getAppointments(req, res)
);

router.delete(
  "/:id",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  (req, res) => appointmentController.cancelAppointment(req, res)
);

router.put(
  "/:id",
  (req, res, next) => authMiddleware.authenticateToken(req, res, next),
  ...validationMiddleware.validateAppointment(false),
  (req, res) => appointmentController.updateAppointment(req, res)
);

export default router;
