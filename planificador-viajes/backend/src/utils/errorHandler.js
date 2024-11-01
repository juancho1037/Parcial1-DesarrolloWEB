class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = (err, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message:
      statusCode >= 500 && process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : message,
  });
};

module.exports = {
  AppError,
  handleError,
};
