import { tool } from "@langchain/core/tools";
import z from "zod";

type TintaResult = {
  nome: string;
  features: string[];
  acabamento: string;
  ambiente: string;
};

export class ListarTodasTintasTool {
  static name = "listar_todas_tintas";
  static description =
    "Use esta ferramenta para listar todas as tintas disponíveis no catálogo. Não requer nenhuma entrada.";

  static tool() {
    return tool(async () => await ListarTodasTintasTool.call(), {
      name: ListarTodasTintasTool.name,
      description: ListarTodasTintasTool.description,
      schema: z.object({}), // Não há entrada para esta ferramenta
    });
  }

  static async call(): Promise<string> {
    try {
      console.log("Tool de listar todas as tintas iniciada");

      const response = await fetch("http://localhost:3333/tinta");
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const tintas: TintaResult[] = await response.json();

      if (tintas.length === 0) {
        return "Nenhuma tinta foi encontrada no catálogo.";
      }

      const contexto = this.formatarResultado(tintas);

      return `Aqui estão todas as tintas disponíveis no catálogo:\n${contexto}`;
    } catch (error) {
      console.error("Erro ao listar tintas:", error);
      return "Ocorreu um erro ao consultar o catálogo de tintas.";
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
}
