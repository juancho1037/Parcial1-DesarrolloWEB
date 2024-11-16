import pool from "../config/database.js";

class AppointmentService {
  static async getByPatient(patientId, date = null) {
    let query = "SELECT * FROM appointments WHERE patient_id = $1";
    const params = [patientId];

    if (date) {
      query += " AND DATE(date_time) = $2";
      params.push(date);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async create(patientId, doctorId, dateTime) {
    // Validar conflictos de horario
    const conflictQuery = `
      SELECT * FROM appointments
      WHERE (patient_id = $1 OR doctor_id = $2) AND date_time = $3;
    `;
    const conflictResult = await pool.query(conflictQuery, [
      patientId,
      doctorId,
      dateTime,
    ]);

    if (conflictResult.rowCount > 0) {
      throw new Error("Conflicto: La cita ya está reservada.");
    }

    // Crear cita
    const query = `
      INSERT INTO appointments (patient_id, doctor_id, date_time)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [patientId, doctorId, dateTime]);
    return result.rows[0];
  }

  static async update(patientId, appointmentId, doctorId, dateTime) {
    // Validar conflictos de horario
    const conflictQuery = `
      SELECT * FROM appointments
      WHERE (patient_id = $1 OR doctor_id = $2) AND date_time = $3 AND id != $4;
    `;
    const conflictResult = await pool.query(conflictQuery, [
      patientId,
      doctorId,
      dateTime,
      appointmentId,
    ]);

    if (conflictResult.rowCount > 0) {
      throw new Error("Conflicto: La cita ya está reservada.");
    }

    // Actualizar cita
    const query = `
      UPDATE appointments
      SET doctor_id = $1, date_time = $2
      WHERE id = $3 AND patient_id = $4
      RETURNING *;
    `;
    const result = await pool.query(query, [
      doctorId,
      dateTime,
      appointmentId,
      patientId,
    ]);
    return result.rows[0];
  }

  static async delete(patientId, appointmentId) {
    const query = `
      DELETE FROM appointments
      WHERE id = $1 AND patient_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [appointmentId, patientId]);

    if (result.rowCount === 0) {
      throw new Error("Cita no encontrada o no pertenece al paciente.");
    }

    return result.rows[0];
  }
}

export default AppointmentService;
