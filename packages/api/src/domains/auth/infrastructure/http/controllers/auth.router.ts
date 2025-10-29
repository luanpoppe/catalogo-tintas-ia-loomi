import { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { LoginDocs } from "../docs/login.docs";
import { RefreshTokenDocs } from "../docs/refresh-token.docs";

export class AuthRouter {
  static async route(app: FastifyInstance) {
    app.post(
      "/login",
      {
        ...(LoginDocs as any),
      },
      AuthController.login
    );

    app.post(
      "/refresh",
      {
        ...(RefreshTokenDocs as any),
      },
      AuthController.refreshToken
    );
  }
}
