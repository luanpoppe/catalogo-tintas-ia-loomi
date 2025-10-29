import prisma from "@catalogo-tintas/database";
import { tool } from "@langchain/core/tools";
import { OpenAIEmbeddings } from "@langchain/openai";
import { env } from "../../../env";
import z from "zod";

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  openAIApiKey: env.OPENAI_API_KEY,
});

interface ToolProps {
  input: string;
}

type TintaResult = {
  nome: string;
  features: string[];
  acabamento: string;
  ambiente: string;
};

export class BuscarTintaTool {
  static name = "buscar_tintas_suvinil";
  static description =
    'Use esta ferramenta para encontrar tintas Suvinil com base nas necessidades, contexto ou preferências do usuário. A entrada deve ser uma descrição do que o usuário procura (ex: "tinta para quarto sem cheiro", "tinta para muro externo que pega chuva").';

  static tool() {
    return tool(
      async ({ input }: ToolProps) => await BuscarTintaTool.call(input),
      {
        name: BuscarTintaTool.name,
        description: BuscarTintaTool.description,
        schema: z.object({
          input: z.string().nonempty(),
        }),
      }
    );
  }

  static async call(input: string): Promise<string> {
    try {
      console.log("Tool de buscar tintas na vector store iniciada");

      const queryVetor = await embeddings.embedQuery(input);

      const tintas = await this.buscarTintasRelevantes(queryVetor);

      if (tintas.length === 0) {
        return "Nenhuma tinta foi encontrada com essas especificações. Peça ao usuário para tentar descrever de outra forma.";
      }

      const contexto = this.formatarResultado(tintas);

      return `Aqui estão as tintas mais relevantes encontradas na base de dados:\n${contexto}`;
    } catch (error) {
      console.error("Erro ao buscar tintas:", error);
      return "Ocorreu um erro ao consultar a base de dados de tintas.";
    }
  }

  private static formatarResultado(tintas: TintaResult[]) {
    return tintas
      .map(
        (t: TintaResult) =>
          `- Tinta: ${t.nome} (Acabamento: ${t.acabamento}, Ambiente: ${
            t.ambiente
          }, Features: ${t.features.join(", ")})`
      )
      .join("\n");
  }

  private static async buscarTintasRelevantes(
    queryEmbedding: number[],
    qtdResultados = 3
  ) {
    const embeddingString = `[${queryEmbedding.join(",")}]`;

    // Garantir que o search_path inclua o schema público onde a extensão pgvector
    // normalmente é instalada durante as migrations do ambiente de teste.
    // Isso ajuda o Postgres a resolver corretamente o tipo `vector` e seus operadores.
    await prisma.$executeRawUnsafe("SET search_path = public");

    const resultados = await prisma.$queryRaw<TintaResult[]>`
    SELECT 
      nome, 
      features, 
      acabamento, 
      ambiente
    FROM "tintas"
    ORDER BY 
      embedding <-> ${embeddingString}::vector
    LIMIT ${qtdResultados}
  `;

    return resultados;
  }
}
