import { FastifyInstance } from "fastify";
import { ChatDocs } from "../docs/chat.docs";
import { ChatController } from "./chat.controller";
import { VerificarUsuarioLogadoMiddleware } from "@/infrastructure/middlewares/verificar-usuario-logado.middleware";

export class ChatRouter {
  static async route(app: FastifyInstance) {
    app.post(
      "/login",
      {
        ...(ChatDocs as any),
        preHandler: VerificarUsuarioLogadoMiddleware.middleware,
      },
      ChatController.sendMessage
    );
  }
}
