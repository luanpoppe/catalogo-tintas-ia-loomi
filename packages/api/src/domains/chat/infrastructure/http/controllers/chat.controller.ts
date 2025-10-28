import { FastifyReply, FastifyRequest } from "fastify";
import { RequestChatDTO } from "../dto/chat.dto";
import { ChatUseCase } from "@/domains/chat/application/use-cases/chat.use-case";

export class ChatController {
  constructor() {}

  static async sendMessage(
    req: FastifyRequest<{
      Body: RequestChatDTO;
    }>,
    reply: FastifyReply
  ) {
    const useCase = new ChatUseCase();
    const userId = req.user.sub;

    const { response } = await useCase.execute(req.body, userId);

    return reply.status(200).send({ aiMessage: response });
  }
}
