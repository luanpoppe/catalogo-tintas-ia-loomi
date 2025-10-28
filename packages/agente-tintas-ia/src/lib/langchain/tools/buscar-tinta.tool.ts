import prisma from "@catalogo-tintas/database";
import { Tool } from "@langchain/core/tools";
import { OpenAIEmbeddings } from "@langchain/openai";
import { env } from "../../../env";

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  openAIApiKey: env.OPENAI_API_KEY,
});

type TintaResult = {
  nome: string;
  features: string[];
  acabamento: string;
  ambiente: string;
};

// A. A FUNÇÃO DE BUSCA (USANDO $queryRaw)
//    (Esta é a parte "RAG" - Retrieval-Augmented Generation)
async function buscarTintasRelevantes(queryEmbedding: number[]) {
  const embeddingString = `[${queryEmbedding.join(",")}]`;

  // O operador '<=>' faz a "busca por similaridade" (cosine distance)
  const resultados = await prisma.$queryRaw<TintaResult[]>`
    SELECT 
      nome, 
      features, 
      acabamento, 
      ambiente
    FROM "tintas"
    ORDER BY 
      embedding <=> ${embeddingString}::vector
    LIMIT 3
  `; // Pega as 3 tintas mais parecidas

  return resultados;
}

// B. A FERRAMENTA (TOOL) DO LANGCHAIN
//    (Isto é o que o Agente vai usar)
export class BuscarTintaTool extends Tool {
  name = "buscar_tintas_suvinil";
  description =
    'Use esta ferramenta para encontrar tintas Suvinil com base nas necessidades, contexto ou preferências do usuário. A entrada deve ser uma descrição do que o usuário procura (ex: "tinta para quarto sem cheiro", "tinta para muro externo que pega chuva").';

  protected async _call(input: string): Promise<string> {
    try {
      const queryVetor = await embeddings.embedQuery(input);

      const tintas = await buscarTintasRelevantes(queryVetor);

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

  private formatarResultado(tintas: TintaResult[]) {
    return tintas
      .map(
        (t: TintaResult) =>
          `- Tinta: ${t.nome} (Acabamento: ${t.acabamento}, Ambiente: ${
            t.ambiente
          }, Features: ${t.features.join(", ")})`
      )
      .join("\n");
  }
}
