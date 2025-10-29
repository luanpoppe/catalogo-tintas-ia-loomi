import { createAgent } from "langchain";
import { Langchain } from "./lib/langchain/langchain";
import { BuscarTintaTool } from "./lib/langchain/tools/buscar-tinta.tool";
import { ShortTermMemory } from "./lib/langchain/short-term-memory";
import { ListarTodasTintasTool } from "./lib/langchain/tools/listar-todas-tintas.tool";
import { BuscarTintasPorQueryTool } from "./lib/langchain/tools/buscar-tintas-por-query.tool";

export class AgenteTintaIA {
  async handle(
    input: string,
    threadId: string,
    shouldEraseMemory: boolean = false
  ) {
    const model = Langchain.models.gemini();
    const tools = [
      BuscarTintaTool.tool(),
      ListarTodasTintasTool.tool(),
      BuscarTintasPorQueryTool.tool(),
    ];
    const checkpointer = await ShortTermMemory.checkpointer();

    try {
      const agent = createAgent({
        model,
        tools,
        checkpointer,
      });

      // if (shouldEraseMemory) await checkpointer.deleteThread(threadId);
      await checkpointer.deleteThread(threadId);

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
