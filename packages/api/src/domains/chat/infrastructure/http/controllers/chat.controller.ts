import { FastifyReply, FastifyRequest } from "fastify";
import { RequestChatDTO, ResponseChatDTO } from "../dto/chat.dto";
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

    try {
      const { response } = await useCase.execute(req.body, userId);

      const responseBody: ResponseChatDTO = { aiMessage: response.texto };
      if (response.urlImagem) responseBody.urlImagem = response.urlImagem;

      return reply.status(200).send(responseBody);
    } catch (error) {
      console.error({ error });
      return reply.status(200).send({
        aiMessage:
          "Erro durante o processamento da mensagem pelo agente de IA. Tente novamente.",
      });
    }
  }
}
