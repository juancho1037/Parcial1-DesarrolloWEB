const express = require("express");
const router = express.Router();

// Ruta de prueba básica
router.get("/test", (req, res) => {
  res.json({
    message: "Backend funcionando correctamente",
    timestamp: new Date(),
    status: "success",
  });
});

// Ruta para probar la base de datos
router.get("/test-db", async (req, res) => {
  try {
    const { pool } = require("../config/database");
    const [result] = await pool.query("SELECT 1 + 1 AS result");
    res.json({
      message: "Conexión a base de datos exitosa",
      result: result[0].result,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al conectar con la base de datos",
      error: error.message,
      status: "error",
    });
  }
});

module.exports = router;
