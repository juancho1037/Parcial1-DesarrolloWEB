const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { validateReview } = require("../middleware/validation");

// Rutas públicas
router.get("/destinations/:destino_id", reviewController.getDestinationReviews);
router.get("/activities/:actividad_id", reviewController.getActivityReviews);

// Rutas que requieren autenticación
router.use(auth);

router.post("/", validateReview, reviewController.createReview);
router.get("/user", reviewController.getUserReviews);
router.put("/:id", validateReview, reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

// Rutas de administrador
router.get("/pending", [auth, admin], reviewController.getPendingReviews);
router.post("/:id/approve", [auth, admin], reviewController.approveReview);

module.exports = router;
