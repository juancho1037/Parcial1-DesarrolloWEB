const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "No hay token de autenticación",
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    if (!user.activo) {
      return res.status(401).json({
        status: "error",
        message: "Usuario desactivado",
      });
    }

    // Agregar el usuario al objeto request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token expirado",
      });
    }

    res.status(401).json({
      status: "error",
      message: "Error de autenticación",
    });
  }
};

module.exports = auth;
