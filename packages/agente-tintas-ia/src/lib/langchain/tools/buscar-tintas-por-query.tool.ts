import { tool } from "@langchain/core/tools";
import z from "zod";

// Definindo os schemas para os enums, conforme encontrados em tintas.entity.ts
const AMBIENTES_SCHEMA = z.enum(["INTERNO", "EXTERNO", "INTERNO_EXTERNO"]);

const ACABAMENTOS_SCHEMA = z.enum(["ACETINADO", "FOSCO", "BRILHANTE"]);

const LINHAS_SCHEMA = z.enum(["PREMIUM", "STANDARD"]);

const TIPOS_DE_SUPERFICIE_SCHEMA = z.enum(["ALVENARIA", "MADEIRA", "FERRO"]);

// Definindo o schema da query para a ferramenta
const TintaQuerySchema = z
  .object({
    cor: z
      .string()
      .optional()
      .describe("A cor da tinta (ex: 'azul', 'branco')."),
    ambiente: AMBIENTES_SCHEMA.optional().describe(
      "O ambiente para o qual a tinta é indicada (ex: 'INTERNO', 'EXTERNO', 'INTERNO_EXTERNO')."
    ),
    acabamento: ACABAMENTOS_SCHEMA.optional().describe(
      "O acabamento da tinta (ex: 'ACETINADO', 'FOSCO', 'BRILHANTE')."
    ),
    features: z
      .string()
      .optional()
      .describe(
        "Características adicionais da tinta, separadas por vírgula (ex: 'sem cheiro, lavável')."
      ),
    linhas: LINHAS_SCHEMA.optional().describe(
      "A linha da tinta (ex: 'PREMIUM', 'STANDARD')."
    ),
    tiposDeSuperfeicie: z
      .array(TIPOS_DE_SUPERFICIE_SCHEMA)
      .optional()
      .describe(
        "Tipos de superfície para os quais a tinta é indicada (ex: ['ALVENARIA', 'MADEIRA'])."
      ),
  })
  .partial(); // Todos os campos são opcionais para a query

type TintaResult = {
  nome: string;
  features: string[];
  acabamento: string;
  ambiente: string;
  cor: string;
  linhas: string;
  tiposDeSuperfeicie: string[];
};

export class BuscarTintasPorQueryTool {
  static name = "buscar_tintas_por_query";
  static description =
    "Use esta ferramenta para encontrar tintas com base em critérios específicos como cor, ambiente, acabamento, características, linha ou tipo de superfície. Forneça os critérios como um objeto JSON.";

  static tool() {
    return tool(
      async (input: z.infer<typeof TintaQuerySchema>) =>
        await BuscarTintasPorQueryTool.call(input),
      {
        name: BuscarTintasPorQueryTool.name,
        description: BuscarTintasPorQueryTool.description,
        schema: TintaQuerySchema,
      }
    );
  }

  static async call(query: z.infer<typeof TintaQuerySchema>): Promise<string> {
    try {
      console.log("Tool de buscar tintas por query iniciada com:", query);

      const params = new URLSearchParams();
      for (const key in query) {
        const value = query[key as keyof typeof query];
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item));
          } else {
            params.append(key, String(value));
          }
        }
      }

      const paramsFormadatos = params.toString();
      console.log({ paramsFormadatos });

      const url = `http://localhost:3333/tinta/search?${paramsFormadatos}`;
      console.log({ url });
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const tintas: TintaResult[] = await response.json();

      if (tintas.length === 0) {
        return "Nenhuma tinta foi encontrada com os critérios fornecidos. Tente ajustar os parâmetros da busca.";
      }

      const contexto = this.formatarResultado(tintas);

      return `Aqui estão as tintas encontradas com base nos seus critérios:\n${contexto}`;
    } catch (error) {
      console.error("Erro ao buscar tintas por query:", error);
      return "Ocorreu um erro ao consultar o catálogo de tintas com os critérios fornecidos.";
    }
  }

  private static formatarResultado(tintas: TintaResult[]) {
    return tintas
      .map(
        (t: TintaResult) =>
          `- Tinta: ${t.nome} (Cor: ${t.cor}, Acabamento: ${
            t.acabamento
          }, Ambiente: ${t.ambiente}, Linha: ${
            t.linhas
          }, Features: ${t.features.join(
            ", "
          )}, Superfícies: ${t.tiposDeSuperfeicie.join(", ")})`
      )
      .join("\n");
  }
}
