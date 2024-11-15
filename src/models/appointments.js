import pool from "../config/database.js";

class Appointment {
  static async createAppointment({ doctorId, patientId, dateTime }) {
    const query = `
      INSERT INTO appointments (doctor_id, patient_id, date_time)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, [doctorId, patientId, dateTime]);
    return result.rows[0];
  }

  static async getAppointmentByDoctorAndDate(doctorId, dateTime) {
    const query = `
      SELECT * FROM appointments
      WHERE doctor_id = $1 AND date_time = $2;
    `;

    const result = await pool.query(query, [doctorId, dateTime]);
    return result.rows[0];
  }

  static async getAppointmentByPatientAndDate(patientId, dateTime) {
    const query = `
      SELECT * FROM appointments
      WHERE patient_id = $1 AND date_time = $2;
    `;

    const result = await pool.query(query, [patientId, dateTime]);
    return result.rows[0];
  }
}

export default Appointment;
