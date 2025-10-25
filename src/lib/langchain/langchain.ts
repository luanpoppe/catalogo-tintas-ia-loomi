import { ShortTermMemory } from "./short-term-memory";
import { createAgent } from "langchain";
import { LangchainModels } from "./models";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

type CreateAgentProps = {
  model: BaseChatModel;
  systemPrompt?: string;
};

export class Langchain {
  static models = LangchainModels;

  static async createAgent({
    model,
    systemPrompt,
  }: CreateAgentProps): Promise<ReturnType<typeof createAgent>> {
    const checkpointer = await ShortTermMemory.checkpointer();

    const agent = createAgent({
      model,
      systemPrompt: systemPrompt ?? "",
      checkpointer,
    });

    return agent;
  }
}
