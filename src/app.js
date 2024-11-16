import express from "express";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandlers.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import pool from "./config/database.js";

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
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.get("/", async (req, res) => {
      res.status(200).json({ message: "Hola!!!" });
    });

    this.app.use("/api/patient", patientRoutes);
    this.app.use("/api/doctor", doctorRoutes);
    this.app.use("/api/", appointmentRoutes);
  }

  errorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.listen();
