const { pool } = require("../config/database");

class User {
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM USUARIOS WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  static async create({ nombre, email, password, foto_perfil = null }) {
    const [result] = await pool.execute(
      "INSERT INTO USUARIOS (nombre, email, password, foto_perfil, fecha_registro, activo) VALUES (?, ?, ?, ?, NOW(), true)",
      [nombre, email, password, foto_perfil]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, nombre, email, foto_perfil, fecha_registro, activo FROM USUARIOS WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async update(id, { nombre, foto_perfil }) {
    const [result] = await pool.execute(
      "UPDATE USUARIOS SET nombre = ?, foto_perfil = ? WHERE id = ?",
      [nombre, foto_perfil, id]
    );
    return result.affectedRows > 0;
  }

  static async changePassword(id, newPassword) {
    const [result] = await pool.execute(
      "UPDATE USUARIOS SET password = ? WHERE id = ?",
      [newPassword, id]
    );
    return result.affectedRows > 0;
  }

  static async deactivate(id) {
    const [result] = await pool.execute(
      "UPDATE USUARIOS SET activo = false WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
