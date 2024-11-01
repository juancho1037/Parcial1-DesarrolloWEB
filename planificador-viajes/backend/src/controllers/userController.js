const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userController = {
  // Registro de nuevo usuario
  async register(req, res) {
    try {
      const { nombre, email, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "El correo electrónico ya está registrado",
        });
      }

      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear el nuevo usuario
      const userId = await User.create({
        nombre,
        email,
        password: hashedPassword,
      });

      // Generar token JWT
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.status(201).json({
        status: "success",
        data: {
          id: userId,
          nombre,
          email,
          token,
        },
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({
        status: "error",
        message: "Error al registrar el usuario",
      });
    }
  },

  // Inicio de sesión
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Credenciales inválidas",
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: "error",
          message: "Credenciales inválidas",
        });
      }

      // Verificar si la cuenta está activa
      if (!user.activo) {
        return res.status(401).json({
          status: "error",
          message: "Cuenta desactivada",
        });
      }

      // Generar token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.json({
        status: "success",
        data: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          foto_perfil: user.foto_perfil,
          token,
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        status: "error",
        message: "Error al iniciar sesión",
      });
    }
  },

  // Obtener perfil del usuario
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Viene del middleware de autenticación
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        });
      }

      res.json({
        status: "success",
        data: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          foto_perfil: user.foto_perfil,
          fecha_registro: user.fecha_registro,
        },
      });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener el perfil",
      });
    }
  },

  // Actualizar perfil
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { nombre, foto_perfil } = req.body;

      const success = await User.update(userId, { nombre, foto_perfil });

      if (!success) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        });
      }

      res.json({
        status: "success",
        message: "Perfil actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el perfil",
      });
    }
  },

  // Cambiar contraseña
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Obtener usuario actual
      const user = await User.findById(userId);

      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          status: "error",
          message: "La contraseña actual es incorrecta",
        });
      }

      // Encriptar nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Actualizar contraseña
      const success = await User.changePassword(userId, hashedPassword);

      if (!success) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        });
      }

      res.json({
        status: "success",
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      res.status(500).json({
        status: "error",
        message: "Error al cambiar la contraseña",
      });
    }
  },

  // Solicitar restablecimiento de contraseña
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      // Buscar el usuario
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "No existe una cuenta con ese correo electrónico",
        });
      }

      // En un entorno real, aquí enviarías un email con el token
      // Por ahora, solo simularemos que se envió
      const resetToken = jwt.sign(
        { id: user.id, action: "reset" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        status: "success",
        message:
          "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña",
        // En producción, NO envíes el token en la respuesta
        ...(process.env.NODE_ENV === "development" && { resetToken }),
      });
    } catch (error) {
      console.error("Error al solicitar reset de contraseña:", error);
      res.status(500).json({
        status: "error",
        message: "Error al procesar la solicitud",
      });
    }
  },
};

module.exports = userController;
