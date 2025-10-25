import { FastifyInstance } from "fastify";
import { UsuariosController } from "./usuarios.controller";
import { CreateUsuarioDocs } from "../docs/create-usuario.docs";
import { DeleteUsuarioDocs } from "../docs/delete-usuario.docs";
import { GetUsuarioByIdDocs } from "../docs/get-usuario-by-id.docs";
import { GetUsuarioByEmailDocs } from "../docs/get-usuario-by-email.docs";
import { UpdateUsuarioDocs } from "../docs/update-usuario.docs";

export class UsuariosRouter {
  static async route(app: FastifyInstance) {
    app.post("/", CreateUsuarioDocs as any, UsuariosController.create);

    app.delete("/:id", DeleteUsuarioDocs as any, UsuariosController.delete);

    app.get("/:id", GetUsuarioByIdDocs, UsuariosController.getById as any);

    app.get(
      "/email/:email",
      GetUsuarioByEmailDocs as any,
      UsuariosController.getByEmail as any
    );

    app.put("/:id", UpdateUsuarioDocs as any, UsuariosController.update);
  }
}
