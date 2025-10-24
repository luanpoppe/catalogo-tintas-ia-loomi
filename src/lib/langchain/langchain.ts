import { createAgent } from "langchain";
import { LangchainModels } from "./models";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

type CreateAgentProps = {
  model: BaseChatModel;
  systemPrompt?: string;
};

export class Langchain {
  static models = LangchainModels;

  static createAgent({
    model,
    systemPrompt,
  }: CreateAgentProps): ReturnType<typeof createAgent> {
    const agent = createAgent({
      model,
      systemPrompt: systemPrompt ?? "",
    });

    return agent;
  }
}
