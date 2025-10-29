import { FastifyInstance } from "fastify";
import { TintasController } from "./tintas.controller";
import { CreateTintaDocs } from "../docs/create-tinta.docs";
import { GetAllTintasDocs } from "../docs/get-all-tintas.docs";
import { GetTintaByIdDocs } from "../docs/get-tinta-by-id.docs";
import { UpdateTintaDocs } from "../docs/update-tinta.docs";
import { DeleteTintaDocs } from "../docs/delete-tinta.docs";
import { GetTintasByQueryDocs } from "../docs/get-tintas-by-query.docs";
import { VerificarUsuarioLogadoMiddleware } from "@/infrastructure/middlewares/verificar-usuario-logado.middleware";
import { VerificarPermissaoDoUsuarioMiddleware } from "@/infrastructure/middlewares/verificar-permissao-do-usuario.middleware";

export class TintasRouter {
  static async route(app: FastifyInstance) {
    app.get("/", GetAllTintasDocs as any, TintasController.getAll);

    app.get(
      "/search",
      {
        ...(GetTintasByQueryDocs as any),
      },
      TintasController.getByQuery
    );

    app.get(
      "/:id",
      {
        ...(GetTintaByIdDocs as any),
      },
      TintasController.getById
    );

    app.post(
      "/",
      {
        ...(CreateTintaDocs as any),
        preHandler: [
          VerificarUsuarioLogadoMiddleware.middleware,
          VerificarPermissaoDoUsuarioMiddleware.middleware("ADMIN"),
        ],
      },
      TintasController.create
    );

    app.patch(
      "/:id",
      {
        ...(UpdateTintaDocs as any),
        preHandler: [
          VerificarUsuarioLogadoMiddleware.middleware,
          VerificarPermissaoDoUsuarioMiddleware.middleware("ADMIN"),
        ],
      },
      TintasController.update
    );

    app.delete(
      "/:id",
      {
        ...(DeleteTintaDocs as any),
        preHandler: [
          VerificarUsuarioLogadoMiddleware.middleware,
          VerificarPermissaoDoUsuarioMiddleware.middleware("ADMIN"),
        ],
      },
      TintasController.delete
    );
  }
}
