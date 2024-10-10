// api.js
const BASE_URL = "http://ec2-3-138-183-128.us-east-2.compute.amazonaws.com:4010";

export default class API {
/**
 * Obtiene una lista de usuarios de la API.
 *
 * @param {number} [limit=5] - El número máximo de usuarios a buscar.
 * @returns {Promise<Object[]>} Una promesa que se resuelve en una matriz de objetos de usuario.
 * @throws {Error} Si hay un error al buscar los usuarios.
 */
  static async getUsers(limit = 5) {
    try {
      const response = await fetch(`${BASE_URL}/users?limit=${limit}`);
      if (!response.ok) {
        alert("Error al encontrar los usuarios.");
        throw new Error("Error al encontrar los usuarios.");
      }
      return await response.json();
    } catch (error) {
      alert("Error al obtener los usuarios");
      console.error("Error al obtener los usuarios", error);
    }
  }

  /**
 * Crea un nuevo usuario enviando una solicitud POST al servidor.
 *
 * @param {Object} user - el objeto de usuario que se creará.
 * @param {string} user.name - el nombre del usuario.
 * @param {string} user.email - el correo electrónico del usuario.
 * @param {string} user.password - la contraseña del usuario.
 * @returns {Promise<Object>} El objeto de usuario creado.
 * @throws {Error} Si hay un error al crear el usuario.
 */
  static async createUser(user) {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        alert("Error al crear usuario");
        throw new Error("Error al crear usuario");
      }
      alert("Usuario creado con éxito");
      return await response.json();
    } catch (error) {
      alert("Error al crear usuario");
      console.error("Error al crear el usuario:", error);
    }
  }

  /**
 * Actualiza un usuario con el ID de usuario especificado y los datos de updatedUser.
 *
 * @param {string} userId - el ID del usuario que se actualizará.
 * @param {Object} updatedUser - los datos de usuario actualizados.
 * @returns {Promise<Object>} Los datos de usuario actualizados.
 * @throws Generará un error si la operación de actualización falla.
 */
  static async updateUser(userId, updatedUser) {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) {
        alert("Error al actualizar el usuario");
        throw new Error("Error al actualizar el usuario");
      }
      alert("Usuario actualizado con éxito");
      return await response.json();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Error al actualizar el usuario:");
    }
  }
}