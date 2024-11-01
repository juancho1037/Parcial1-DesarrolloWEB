const admin = (req, res, next) => {
  // El middleware de auth ya debería haber ejecutado y agregado el usuario al request
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "No autenticado",
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado - Se requieren privilegios de administrador",
    });
  }

  next();
};

module.exports = admin;
