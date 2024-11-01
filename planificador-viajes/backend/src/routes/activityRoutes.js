const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const auth = require("../middleware/auth");
const { validateActivity } = require("../middleware/validation");

// Todas las rutas de actividades requieren autenticación
router.use(auth);

// Rutas de actividades dentro de un viaje
router.post(
  "/trips/:viaje_id/activities",
  validateActivity,
  activityController.createActivity
);
router.get("/trips/:viaje_id/activities", activityController.getTripActivities);
router.get(
  "/trips/:viaje_id/activities/:actividad_id",
  activityController.getActivityDetails
);
router.put(
  "/trips/:viaje_id/activities/:actividad_id",
  validateActivity,
  activityController.updateActivity
);
router.delete(
  "/trips/:viaje_id/activities/:actividad_id",
  activityController.deleteActivity
);

module.exports = router;
