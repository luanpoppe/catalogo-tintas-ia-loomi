import { FastifyInstance } from "fastify";
import { UsuariosController } from "./usuarios.controller";
import { CreateUsuarioDocs } from "../docs/create-usuario.docs";

export class UsuariosRouter {
  static async route(app: FastifyInstance) {
    app.post("/", CreateUsuarioDocs as any, UsuariosController.create);
  }
}
