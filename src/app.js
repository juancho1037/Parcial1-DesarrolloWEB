import express from "express";
import dotenv from "dotenv";
import errorHandlers from "./middlewares/errorHandlers.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  middlewares() {
    // Middleware para parsear JSON y formularios
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    // Ruta de prueba
    this.app.get("/", (req, res) => {
      res.status(200).json({ message: "Servidor funcionando correctamente." });
    });

    // Rutas principales
    this.app.use("/api/patient", patientRoutes);
    this.app.use("/api/doctor", doctorRoutes);
    this.app.use("/api/appointment", appointmentRoutes);
  }

  errorHandling() {
    // Manejo de rutas no encontradas y errores generales
    this.app.use((req, res, next) =>
      errorHandlers.notFoundHandler(req, res, next)
    );
    this.app.use((err, req, res, next) =>
      errorHandlers.errorHandler(err, req, res, next)
    );
  }

  listen() {
    // Iniciar el servidor
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.listen();
