import { createAgent } from "langchain";
import { Langchain } from "./lib/langchain/langchain";
import { BuscarTintaTool } from "./lib/langchain/tools/buscar-tinta.tool";
import { ShortTermMemory } from "./lib/langchain/short-term-memory";

export class AgenteTintaIA {
  async handle(input: string, threadId: string) {
    const model = Langchain.models.openAI();
    const tools = [new BuscarTintaTool()];
    const checkpointer = await ShortTermMemory.checkpointer();

    try {
      const agent = createAgent({
        model,
        tools,
        checkpointer,
      });

      const fullResponse = await agent.invoke(
        {
          messages: [{ role: "user", content: input }],
        },
        { configurable: { thread_id: threadId } }
      );

      return fullResponse.messages.at(-1)?.content;
    } catch (error: any) {
      console.error("Erro ao executar o agente de IA:", error);
      throw new Error("Falha ao processar a requisição da IA.");
    }
  }
}
