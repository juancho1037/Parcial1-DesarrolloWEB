const { pool } = require("../config/database");

class Trip {
  static async create({
    usuario_id,
    destino_id,
    titulo,
    fecha_inicio,
    fecha_fin,
    presupuesto,
  }) {
    const [result] = await pool.execute(
      `INSERT INTO VIAJES (
        usuario_id, 
        destino_id, 
        titulo, 
        fecha_inicio, 
        fecha_fin, 
        estado, 
        presupuesto, 
        fecha_creacion, 
        fecha_actualizacion
      ) VALUES (?, ?, ?, ?, ?, 'PLANIFICADO', ?, NOW(), NOW())`,
      [usuario_id, destino_id, titulo, fecha_inicio, fecha_fin, presupuesto]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT v.*, d.nombre as destino_nombre, d.pais, d.ciudad 
       FROM VIAJES v 
       JOIN DESTINOS d ON v.destino_id = d.id 
       WHERE v.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUserId(usuario_id) {
    const [rows] = await pool.execute(
      `SELECT v.*, d.nombre as destino_nombre, d.pais, d.ciudad 
       FROM VIAJES v 
       JOIN DESTINOS d ON v.destino_id = d.id 
       WHERE v.usuario_id = ?
       ORDER BY v.fecha_inicio ASC`,
      [usuario_id]
    );
    return rows;
  }

  static async update(
    id,
    { titulo, fecha_inicio, fecha_fin, estado, presupuesto }
  ) {
    const [result] = await pool.execute(
      `UPDATE VIAJES 
       SET titulo = ?, 
           fecha_inicio = ?, 
           fecha_fin = ?, 
           estado = ?, 
           presupuesto = ?,
           fecha_actualizacion = NOW()
       WHERE id = ?`,
      [titulo, fecha_inicio, fecha_fin, estado, presupuesto, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    // Primero eliminamos las actividades relacionadas
    await pool.execute("DELETE FROM ACTIVIDADES WHERE viaje_id = ?", [id]);
    // Luego eliminamos el viaje
    const [result] = await pool.execute("DELETE FROM VIAJES WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }

  static async getTotalCost(id) {
    const [rows] = await pool.execute(
      `SELECT SUM(costo) as total_cost 
       FROM ACTIVIDADES 
       WHERE viaje_id = ?`,
      [id]
    );
    return rows[0].total_cost || 0;
  }
}

module.exports = Trip;
