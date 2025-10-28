import { AgenteTintaIA } from "@catalogo-tintas/agente-ia";
import { RequestChatDTO } from "../../infrastructure/http/dto/chat.dto";

export class ChatUseCase {
  constructor() {}

  async execute(
    { userMessage, shouldEraseMemory }: RequestChatDTO,
    userId: number
  ) {
    const agente = new AgenteTintaIA();
    const response = await agente.handle(
      userMessage,
      userId.toString(),
      shouldEraseMemory
    );

    return { response };
  }
}
