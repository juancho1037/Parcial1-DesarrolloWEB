export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error en el servidor" });
};
