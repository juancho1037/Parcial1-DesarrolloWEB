const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const auth = require("../middleware/auth");
const { validateTrip } = require("../middleware/validation");

// Todas las rutas de viajes requieren autenticación
router.use(auth);

// Rutas de viajes
router.post("/", validateTrip, tripController.createTrip);
router.get("/", tripController.getUserTrips);
router.get("/:id", tripController.getTripDetails);
router.put("/:id", validateTrip, tripController.updateTrip);
router.delete("/:id", tripController.deleteTrip);

module.exports = router;
