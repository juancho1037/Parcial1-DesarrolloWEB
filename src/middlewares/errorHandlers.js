class ErrorHandlers {
  // Método para manejar rutas no encontradas
  notFoundHandler(req, res, next) {
    res.status(404).json({ message: "Ruta no encontrada" });
  }

  // Método para manejar errores generales
  errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// Exportar una instancia de la clase
export default new ErrorHandlers();
