import { FastifyInstance } from "fastify";
import { UsuariosController } from "./usuarios.controller";
import { CreateUsuarioDocs } from "../docs/create-usuario.docs";
import { DeleteUsuarioDocs } from "../docs/delete-usuario.docs";
import { GetUsuarioByIdDocs } from "../docs/get-usuario-by-id.docs";
import { GetUsuarioByEmailDocs } from "../docs/get-usuario-by-email.docs";
import { UpdateUsuarioDocs } from "../docs/update-usuario.docs";
import { VerifyUserRole } from "@/infrastructure/middlewares/verify-user-role";
import { VerifyJwtMiddleware } from "@/infrastructure/middlewares/verify-jwt.middleware";

export class UsuariosRouter {
  static async route(app: FastifyInstance) {
    app.get(
      "/:id",
      { ...GetUsuarioByIdDocs, preHandler: VerifyJwtMiddleware.middleware },
      UsuariosController.getById as any
    );

    app.get(
      "/email/:email",
      {
        ...(GetUsuarioByEmailDocs as any),
        preHandler: VerifyJwtMiddleware.middleware,
      },
      UsuariosController.getByEmail as any
    );

    app.post(
      "/",
      {
        ...(CreateUsuarioDocs as any),
        preHandler: VerifyUserRole.middleware("ADMIN"),
      },
      UsuariosController.create
    );

    app.delete(
      "/:id",
      {
        ...(DeleteUsuarioDocs as any),
        preHandler: VerifyUserRole.middleware("ADMIN"),
      },
      UsuariosController.delete
    );

    app.put(
      "/:id",
      {
        ...(UpdateUsuarioDocs as any),
        preHandler: VerifyUserRole.middleware("ADMIN"),
      },
      UsuariosController.update
    );
  }
}
