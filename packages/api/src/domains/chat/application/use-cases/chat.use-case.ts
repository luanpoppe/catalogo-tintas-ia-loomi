import { AgenteTintaIA } from "../../../../../../agente-tintas-ia/";
import { RequestChatDTO } from "../../infrastructure/http/dto/chat.dto";

export class ChatUseCase {
  constructor() {}

  async execute({ userMessage }: RequestChatDTO) {
    const agente = new AgenteTintaIA();
    const response = await agente.handle(userMessage, "2");

    return { response };
  }
}
