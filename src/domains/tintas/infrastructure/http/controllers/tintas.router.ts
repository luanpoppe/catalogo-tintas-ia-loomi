import { FastifyInstance } from "fastify";
import { TintasController } from "./tintas.controller";
import { CreateTintaDocs } from "../docs/create-tinta.docs";
import { GetAllTintasDocs } from "../docs/get-all-tintas.docs";
import { GetTintaByIdDocs } from "../docs/get-tinta-by-id.docs";
import { UpdateTintaDocs } from "../docs/update-tinta.docs";
import { DeleteTintaDocs } from "../docs/delete-tinta.docs";
import { GetTintasByQueryDocs } from "../docs/get-tintas-by-query.docs";
import { VerifyJwtMiddleware } from "@/infrastructure/middlewares/verify-jwt.middleware";
import { VerifyUserRole } from "@/infrastructure/middlewares/verify-user-role";

export class TintasRouter {
  static async route(app: FastifyInstance) {
    app.addHook("preHandler", VerifyJwtMiddleware.middleware);

    app.get("/", GetAllTintasDocs as any, TintasController.getAll);

    app.get(
      "/search",
      GetTintasByQueryDocs as any,
      TintasController.getByQuery
    );

    app.get("/:id", GetTintaByIdDocs as any, TintasController.getById);

    app.post(
      "/",
      {
        ...(CreateTintaDocs as any),
        preHandler: VerifyUserRole.middleware("ADMIN"),
      },
      TintasController.create
    );

    app.patch(
      "/:id",
      {
        ...(UpdateTintaDocs as any),
        preHandler: VerifyUserRole.middleware("ADMIN"),
      },
      TintasController.update
    );

    app.delete(
      "/:id",
      {
        ...(DeleteTintaDocs as any),
        preHandler: VerifyUserRole.middleware("ADMIN"),
      },
      TintasController.delete
    );
  }
}
