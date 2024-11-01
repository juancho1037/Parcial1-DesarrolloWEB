const { pool } = require("../config/database");

class Review {
  static async create({
    usuario_id,
    destino_id,
    actividad_id,
    calificacion,
    comentario,
  }) {
    const [result] = await pool.execute(
      `INSERT INTO RESENAS (
        usuario_id,
        destino_id,
        actividad_id,
        calificacion,
        comentario,
        fecha_creacion,
        aprobada
      ) VALUES (?, ?, ?, ?, ?, NOW(), false)`,
      [usuario_id, destino_id, actividad_id, calificacion, comentario]
    );
    return result.insertId;
  }

  static async findByDestination(destino_id) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.nombre as usuario_nombre
       FROM RESENAS r
       JOIN USUARIOS u ON r.usuario_id = u.id
       WHERE r.destino_id = ? AND r.aprobada = true
       ORDER BY r.fecha_creacion DESC`,
      [destino_id]
    );
    return rows;
  }

  static async findByActivity(actividad_id) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.nombre as usuario_nombre
       FROM RESENAS r
       JOIN USUARIOS u ON r.usuario_id = u.id
       WHERE r.actividad_id = ? AND r.aprobada = true
       ORDER BY r.fecha_creacion DESC`,
      [actividad_id]
    );
    return rows;
  }

  static async findByUser(usuario_id) {
    const [rows] = await pool.execute(
      `SELECT r.*, 
              d.nombre as destino_nombre,
              a.nombre as actividad_nombre
       FROM RESENAS r
       LEFT JOIN DESTINOS d ON r.destino_id = d.id
       LEFT JOIN ACTIVIDADES a ON r.actividad_id = a.id
       WHERE r.usuario_id = ?
       ORDER BY r.fecha_creacion DESC`,
      [usuario_id]
    );
    return rows;
  }

  static async update(id, { calificacion, comentario }) {
    const [result] = await pool.execute(
      `UPDATE RESENAS 
       SET calificacion = ?,
           comentario = ?
       WHERE id = ?`,
      [calificacion, comentario, id]
    );
    return result.affectedRows > 0;
  }

  static async approve(id) {
    const [result] = await pool.execute(
      "UPDATE RESENAS SET aprobada = true WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM RESENAS WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }

  static async getAverageRating(destino_id = null, actividad_id = null) {
    let query = "SELECT AVG(calificacion) as promedio FROM RESENAS WHERE ";
    let params = [];

    if (destino_id) {
      query += "destino_id = ?";
      params.push(destino_id);
    } else if (actividad_id) {
      query += "actividad_id = ?";
      params.push(actividad_id);
    }

    query += " AND aprobada = true";

    const [rows] = await pool.execute(query, params);
    return rows[0].promedio || 0;
  }
}

module.exports = Review;
