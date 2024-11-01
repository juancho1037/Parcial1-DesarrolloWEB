const { pool } = require("../config/database");

class Activity {
  static async create({
    viaje_id,
    destino_id,
    nombre,
    descripcion,
    categoria,
    fecha_hora,
    costo,
    ubicacion,
    duracion_minutos,
  }) {
    const [result] = await pool.execute(
      `INSERT INTO ACTIVIDADES (
        viaje_id,
        destino_id,
        nombre,
        descripcion,
        categoria,
        fecha_hora,
        costo,
        ubicacion,
        estado,
        duracion_minutos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE', ?)`,
      [
        viaje_id,
        destino_id,
        nombre,
        descripcion,
        categoria,
        fecha_hora,
        costo,
        ubicacion,
        duracion_minutos,
      ]
    );
    return result.insertId;
  }

  static async findByTripId(viaje_id) {
    const [rows] = await pool.execute(
      `SELECT * FROM ACTIVIDADES 
       WHERE viaje_id = ? 
       ORDER BY fecha_hora ASC`,
      [viaje_id]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM ACTIVIDADES WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async update(
    id,
    {
      nombre,
      descripcion,
      categoria,
      fecha_hora,
      costo,
      ubicacion,
      estado,
      duracion_minutos,
    }
  ) {
    const [result] = await pool.execute(
      `UPDATE ACTIVIDADES 
       SET nombre = ?,
           descripcion = ?,
           categoria = ?,
           fecha_hora = ?,
           costo = ?,
           ubicacion = ?,
           estado = ?,
           duracion_minutos = ?
       WHERE id = ?`,
      [
        nombre,
        descripcion,
        categoria,
        fecha_hora,
        costo,
        ubicacion,
        estado,
        duracion_minutos,
        id,
      ]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM ACTIVIDADES WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findByDestination(destino_id) {
    const [rows] = await pool.execute(
      `SELECT * FROM ACTIVIDADES 
       WHERE destino_id = ? 
       ORDER BY fecha_hora ASC`,
      [destino_id]
    );
    return rows;
  }
}

module.exports = Activity;
