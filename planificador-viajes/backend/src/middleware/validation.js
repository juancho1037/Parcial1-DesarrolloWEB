const { body, validationResult } = require("express-validator");

// Función para manejar los resultados de la validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validaciones para registro de usuario
const validateRegistration = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una letra minúscula")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula"),

  handleValidationErrors,
];

// Validaciones para login
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Email inválido"),

  body("password").trim().notEmpty().withMessage("La contraseña es requerida"),

  handleValidationErrors,
];

// Validaciones para viajes
const validateTrip = [
  body("titulo")
    .trim()
    .notEmpty()
    .withMessage("El título es requerido")
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres"),

  body("fecha_inicio")
    .notEmpty()
    .withMessage("La fecha de inicio es requerida")
    .isISO8601()
    .withMessage("Formato de fecha inválido"),

  body("fecha_fin")
    .notEmpty()
    .withMessage("La fecha de fin es requerida")
    .isISO8601()
    .withMessage("Formato de fecha inválido")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.fecha_inicio)) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio"
        );
      }
      return true;
    }),

  body("destino_id")
    .notEmpty()
    .withMessage("El destino es requerido")
    .isInt()
    .withMessage("ID de destino inválido"),

  body("presupuesto")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El presupuesto debe ser un número positivo"),

  handleValidationErrors,
];

// Validaciones para actividades
const validateActivity = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),

  body("fecha_hora")
    .notEmpty()
    .withMessage("La fecha y hora son requeridas")
    .isISO8601()
    .withMessage("Formato de fecha y hora inválido"),

  body("categoria").trim().notEmpty().withMessage("La categoría es requerida"),

  body("ubicacion").trim().notEmpty().withMessage("La ubicación es requerida"),

  body("costo")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El costo debe ser un número positivo"),

  body("duracion_minutos")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La duración debe ser un número positivo"),

  handleValidationErrors,
];

// Validaciones para destinos
const validateDestination = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),

  body("pais").trim().notEmpty().withMessage("El país es requerido"),

  body("ciudad").trim().notEmpty().withMessage("La ciudad es requerida"),

  body("descripcion")
    .trim()
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no debe exceder los 1000 caracteres"),

  body("clima").trim().optional(),

  body("moneda").trim().optional(),

  body("zona_horaria").trim().optional(),

  handleValidationErrors,
];

// Validaciones para reseñas
const validateReview = [
  body("calificacion")
    .notEmpty()
    .withMessage("La calificación es requerida")
    .isInt({ min: 1, max: 5 })
    .withMessage("La calificación debe estar entre 1 y 5"),

  body("comentario")
    .trim()
    .notEmpty()
    .withMessage("El comentario es requerido")
    .isLength({ min: 10, max: 500 })
    .withMessage("El comentario debe tener entre 10 y 500 caracteres"),

  body("destino_id")
    .optional()
    .isInt()
    .withMessage("ID de destino inválido")
    .custom((value, { req }) => {
      if (!value && !req.body.actividad_id) {
        throw new Error("Debe proporcionar un destino o una actividad");
      }
      return true;
    }),

  body("actividad_id")
    .optional()
    .isInt()
    .withMessage("ID de actividad inválido"),

  handleValidationErrors,
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateTrip,
  validateActivity,
  validateDestination,
  validateReview,
};
