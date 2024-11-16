import JWT from "../config/jwt.js";

export const authenticateToken = (req, res, next) => {
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
};

// export const authorizeRole = (requiredRole) => {
//   return (req, res, next) => {
//     const { role } = req.user;

//     if (role !== requiredRole) {
//       return res
//         .status(403)
//         .json({ message: "No tienes permiso para realizar esta acción." });
//     }

//     next();
//   };
// };
