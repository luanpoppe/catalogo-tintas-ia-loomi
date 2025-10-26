import { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { VerificarUsuarioLogadoMiddleware } from "@/infrastructure/middlewares/verificar-usuario-logado.middleware";
import { LoginDocs } from "../docs/login.docs";
import { RefreshTokenDocs } from "../docs/refresh-token.docs";

export class AuthRouter {
  static async route(app: FastifyInstance) {
    app.post(
      "/login",
      {
        ...(LoginDocs as any),
        preHandler: VerificarUsuarioLogadoMiddleware.middleware,
      },
      AuthController.login
    );

    app.post(
      "/refresh",
      {
        ...(RefreshTokenDocs as any),
        preHandler: VerificarUsuarioLogadoMiddleware.middleware,
      },
      AuthController.refreshToken
    );
  }
}
