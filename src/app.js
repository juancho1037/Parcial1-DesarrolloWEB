import express from "express";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandlers.js";

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
    this.app.get("/", (req, res) => {
      res.send("Servidor funcionando correctamente.");
    });
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
