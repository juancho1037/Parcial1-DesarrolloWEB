import JWT from "../config/jwt.js";

class AuthMiddleware {
  // Método para autenticar el token
  authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
      const user = JWT.verifyToken(token);
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Token no válido." });
    }
  }
}

// Exportar una instancia de la clase
export default new AuthMiddleware();
