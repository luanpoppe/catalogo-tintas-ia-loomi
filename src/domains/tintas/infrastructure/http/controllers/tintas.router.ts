import { FastifyInstance } from "fastify";
import { TintasController } from "./tintas.controller";
import { CreateTintaDocs } from "../docs/create-tinta.docs";

export class TintasRouter {
  static async route(app: FastifyInstance) {
    app.post("/", CreateTintaDocs as any, TintasController.create);
  }
}
