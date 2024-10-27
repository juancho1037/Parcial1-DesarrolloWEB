import * as yup from "yup";

// Schemas de validación comunes
export const schemas = {
  // Usuario
  email: yup
    .string()
    .required("El email es requerido")
    .email("Ingresa un email válido")
    .max(255, "El email es demasiado largo"),

  password: yup
    .string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .matches(/[!@#$%^&*]/, "Debe contener al menos un carácter especial"),

  name: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo"),

  // Viajes
  tripTitle: yup
    .string()
    .required("El título es requerido")
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título es demasiado largo"),

  tripDates: yup.object({
    startDate: yup
      .date()
      .required("La fecha de inicio es requerida")
      .min(new Date(), "La fecha debe ser futura"),
    endDate: yup
      .date()
      .required("La fecha de fin es requerida")
      .min(
        yup.ref("startDate"),
        "La fecha de fin debe ser posterior a la de inicio"
      ),
  }),

  budget: yup
    .number()
    .positive("El presupuesto debe ser positivo")
    .typeError("Ingresa un número válido"),

  // Actividades
  activityTitle: yup
    .string()
    .required("El título es requerido")
    .max(100, "El título es demasiado largo"),

  activityTime: yup
    .string()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (HH:MM)"
    ),

  // Reseñas
  rating: yup
    .number()
    .required("La calificación es requerida")
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),

  review: yup
    .string()
    .required("La reseña es requerida")
    .min(10, "La reseña debe tener al menos 10 caracteres")
    .max(500, "La reseña es demasiado larga"),
};

// Funciones de validación reutilizables
export const validators = {
  // Validar un objeto completo contra un schema
  async validateSchema(schema, data) {
    try {
      await schema.validate(data, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (err) {
      const errors = {};
      err.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      return { isValid: false, errors };
    }
  },

  // Validar un campo individual
  async validateField(schema, value) {
    try {
      await schema.validate(value);
      return { isValid: true, error: null };
    } catch (err) {
      return { isValid: false, error: err.message };
    }
  },

  // Validaciones específicas
  isStrongPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      isValid:
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar &&
        isLongEnough,
      requirements: {
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        isLongEnough,
      },
    };
  },

  isValidDate(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  },

  isValidTime(timeStr) {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
  },

  isValidCurrency(value) {
    return !isNaN(value) && value >= 0;
  },

  isValidPhoneNumber(phone) {
    return /^\+?[1-9]\d{9,14}$/.test(phone);
  },

  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// Rules para Vuetify
export const rules = {
  required: (v) => !!v || "Este campo es requerido",
  email: (v) => /.+@.+\..+/.test(v) || "Email debe ser válido",
  min: (min) => (v) => !v || v.length >= min || `Mínimo ${min} caracteres`,
  max: (max) => (v) => !v || v.length <= max || `Máximo ${max} caracteres`,
  numeric: (v) => !v || !isNaN(v) || "Debe ser un número",
  positive: (v) => !v || v > 0 || "Debe ser mayor a 0",
  url: (v) => !v || /^https?:\/\/.+\..+$/.test(v) || "URL inválida",
  phone: (v) => !v || /^\+?[1-9]\d{9,14}$/.test(v) || "Teléfono inválido",
  passwordMatch: (password) => (v) =>
    v === password || "Las contraseñas no coinciden",
};

export default {
  schemas,
  validators,
  rules,
};
