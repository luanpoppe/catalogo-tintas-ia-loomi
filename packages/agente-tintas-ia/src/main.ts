import { createAgent } from "langchain";
import { Langchain } from "./lib/langchain/langchain";
import { BuscarTintaTool } from "./lib/langchain/tools/buscar-tinta.tool";
import { ShortTermMemory } from "./lib/langchain/short-term-memory";
import { ListarTodasTintasTool } from "./lib/langchain/tools/listar-todas-tintas.tool";
import { BuscarTintasPorQueryTool } from "./lib/langchain/tools/buscar-tintas-por-query.tool";
import { BuscarInternetTool } from "./lib/langchain/tools/buscar-internet.tool";
import { GerarImagemTintaTool } from "./lib/langchain/tools/gerar-imagem-tinta.tool";
import z from "zod";

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
      BuscarInternetTool.tool(),
      GerarImagemTintaTool.tool(),
    ];
    const checkpointer = await ShortTermMemory.checkpointer();

    const responseFormat = z.object({
      texto: z
        .string()
        .nonempty()
        .describe("Texto a ser enviado ao usuário final."),
      urlImagem: z
        .optional(z.string())
        .describe(
          "Em caso de uso da tool de geração de imagem, passe a url da imagem gerada aqui. Se esta tool não for utilizada, você nãodeve passar nenhumvalor aqui."
        ),
    });

    try {
      const agent = createAgent({
        model,
        tools,
        checkpointer,
        responseFormat,
      });

      if (shouldEraseMemory) await checkpointer.deleteThread(threadId);

      const fullResponse = await agent.invoke(
        {
          messages: [{ role: "user", content: input }],
        },
        { configurable: { thread_id: threadId } }
      );

      return fullResponse.structuredResponse;
    } catch (error: any) {
      console.error("Erro ao executar o agente de IA:", error);
      throw new Error("Falha ao processar a requisição da IA.");
    }
  }
}
