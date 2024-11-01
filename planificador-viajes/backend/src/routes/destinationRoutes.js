const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/destinationController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { validateDestination } = require("../middleware/validation");

// Rutas públicas
router.get("/", destinationController.getDestinations);
router.get("/popular", destinationController.getPopularDestinations);
router.get("/search", destinationController.searchDestinations);
router.get("/:id", destinationController.getDestinationDetails);

// Rutas protegidas (requieren autenticación y rol de administrador)
router.post(
  "/",
  [auth, admin],
  validateDestination,
  destinationController.createDestination
);
router.put(
  "/:id",
  [auth, admin],
  validateDestination,
  destinationController.updateDestination
);

module.exports = router;
