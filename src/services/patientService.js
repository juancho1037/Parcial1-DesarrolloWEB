import pool from "../config/database.js";

class PatientService {
  static async authenticate(email, password) {
    const query = "SELECT * FROM patients WHERE email = $1 AND password = $2;";
    const result = await pool.query(query, [email, password]);

    if (result.rowCount === 0) {
      return null; // Usuario no encontrado
    }

    return result.rows[0]; // Devolver los datos del paciente
  }

  static async getById(patientId) {
    const query = "SELECT * FROM patients WHERE id = $1;";
    const result = await pool.query(query, [patientId]);

    return result.rows[0];
  }
}

export default PatientService;
