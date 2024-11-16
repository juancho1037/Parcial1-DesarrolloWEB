import pool from "../config/database.js";

class DoctorService {
  static async getById(doctorId) {
    const query = "SELECT * FROM doctors WHERE id = $1;";
    const result = await pool.query(query, [doctorId]);

    return result.rows[0];
  }

  static async getAppointments(doctorId) {
    const query = `
      SELECT * FROM appointments
      WHERE doctor_id = $1;
    `;
    const result = await pool.query(query, [doctorId]);

    return result.rows;
  }
}

export default DoctorService;
