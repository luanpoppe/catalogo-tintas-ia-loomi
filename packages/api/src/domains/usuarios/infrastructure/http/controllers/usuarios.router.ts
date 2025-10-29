import { FastifyInstance } from "fastify";
import { UsuariosController } from "./usuarios.controller";
import { CreateUsuarioDocs } from "../docs/create-usuario.docs";
import { DeleteUsuarioDocs } from "../docs/delete-usuario.docs";
import { GetUsuarioByIdDocs } from "../docs/get-usuario-by-id.docs";
import { GetUsuarioByEmailDocs } from "../docs/get-usuario-by-email.docs";
import { UpdateUsuarioDocs } from "../docs/update-usuario.docs";
import { VerificarPermissaoDoUsuarioMiddleware } from "@/infrastructure/middlewares/verificar-permissao-do-usuario.middleware";
import { VerificarUsuarioLogadoMiddleware } from "@/infrastructure/middlewares/verificar-usuario-logado.middleware";

export class UsuariosRouter {
  static async route(app: FastifyInstance) {
    app.get(
      "/:id",
      {
        ...GetUsuarioByIdDocs,
        preHandler: [
          VerificarUsuarioLogadoMiddleware.middleware,
          VerificarPermissaoDoUsuarioMiddleware.middleware("ADMIN"),
        ],
      },
      UsuariosController.getById as any
    );

    app.get(
      "/email/:email",
      {
        ...(GetUsuarioByEmailDocs as any),
        preHandler: [
          VerificarUsuarioLogadoMiddleware.middleware,
          VerificarPermissaoDoUsuarioMiddleware.middleware("ADMIN"),
        ],
      },
      UsuariosController.getByEmail as any
    );

    app.post(
      "/",
      {
        ...(CreateUsuarioDocs as any),
      },
      UsuariosController.create
    );

    app.delete(
      "/:id",
      {
        ...(DeleteUsuarioDocs as any),
        preHandler: [
          VerificarUsuarioLogadoMiddleware.middleware,
          VerificarPermissaoDoUsuarioMiddleware.middleware("ADMIN"),
        ],
      },
      UsuariosController.delete
    );

    app.put(
      "/:id",
      {
        ...(UpdateUsuarioDocs as any),
        preHandler: [
          VerificarUsuarioLogadoMiddleware.middleware,
          VerificarPermissaoDoUsuarioMiddleware.middleware("ADMIN"),
        ],
      },
      UsuariosController.update
    );
  }
}
