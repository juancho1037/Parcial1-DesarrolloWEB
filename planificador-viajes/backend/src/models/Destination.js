const { pool } = require("../config/database");

class Destination {
  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT 
        d.*,
        (SELECT AVG(calificacion) FROM RESENAS WHERE destino_id = d.id) as calificacion_promedio
       FROM DESTINOS d`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT 
        d.*,
        (SELECT AVG(calificacion) FROM RESENAS WHERE destino_id = d.id) as calificacion_promedio
       FROM DESTINOS d
       WHERE d.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async search({ pais, ciudad, calificacion_minima }) {
    let query = `SELECT 
                  d.*,
                  (SELECT AVG(calificacion) FROM RESENAS WHERE destino_id = d.id) as calificacion_promedio
                 FROM DESTINOS d
                 WHERE 1=1`;
    const params = [];

    if (pais) {
      query += " AND pais LIKE ?";
      params.push(`%${pais}%`);
    }
    if (ciudad) {
      query += " AND ciudad LIKE ?";
      params.push(`%${ciudad}%`);
    }
    if (calificacion_minima) {
      query += ` AND (SELECT AVG(calificacion) FROM RESENAS WHERE destino_id = d.id) >= ?`;
      params.push(calificacion_minima);
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async create({
    nombre,
    pais,
    ciudad,
    descripcion,
    clima,
    moneda,
    zona_horaria,
    idioma_principal,
    imagen_url,
  }) {
    const [result] = await pool.execute(
      `INSERT INTO DESTINOS (
        nombre,
        pais,
        ciudad,
        descripcion,
        clima,
        moneda,
        zona_horaria,
        idioma_principal,
        imagen_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        pais,
        ciudad,
        descripcion,
        clima,
        moneda,
        zona_horaria,
        idioma_principal,
        imagen_url,
      ]
    );
    return result.insertId;
  }

  static async update(
    id,
    {
      nombre,
      descripcion,
      clima,
      moneda,
      zona_horaria,
      idioma_principal,
      imagen_url,
    }
  ) {
    const [result] = await pool.execute(
      `UPDATE DESTINOS 
       SET nombre = ?,
           descripcion = ?,
           clima = ?,
           moneda = ?,
           zona_horaria = ?,
           idioma_principal = ?,
           imagen_url = ?
       WHERE id = ?`,
      [
        nombre,
        descripcion,
        clima,
        moneda,
        zona_horaria,
        idioma_principal,
        imagen_url,
        id,
      ]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Destination;
