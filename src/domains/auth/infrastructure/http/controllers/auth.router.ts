import { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { VerifyJwtMiddleware } from "@/infrastructure/middlewares/verify-jwt.middleware";
import { LoginDocs } from "../docs/login.docs";
import { RefreshTokenDocs } from "../docs/refresh-token.docs";

export class AuthRouter {
  static async route(app: FastifyInstance) {
    app.post(
      "/login",
      {
        ...(LoginDocs as any),
        preHandler: VerifyJwtMiddleware.middleware,
      },
      AuthController.login
    );

    app.post(
      "/refresh",
      {
        ...(RefreshTokenDocs as any),
        preHandler: VerifyJwtMiddleware.middleware,
      },
      AuthController.refreshToken
    );
  }
}
