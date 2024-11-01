const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const {
  validateRegistration,
  validateLogin,
} = require("../middleware/validation");

// Rutas públicas de autenticación
router.post("/register", validateRegistration, userController.register);
router.post("/login", validateLogin, userController.login);
router.post("/forgot-password", userController.requestPasswordReset);

// Rutas protegidas (requieren autenticación)
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);
router.put("/change-password", auth, userController.changePassword);

module.exports = router;
