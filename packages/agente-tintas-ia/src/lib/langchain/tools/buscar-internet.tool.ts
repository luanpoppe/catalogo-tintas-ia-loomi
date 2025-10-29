import { env } from "@/env";
import { TavilySearch } from "@langchain/tavily";

export class BuscarInternetTool {
  static name = "buscar_na_internet";
  static description =
    'Use esta ferramenta para encontrar tintas Suvinil com base nas necessidades, contexto ou preferências do usuário. A entrada deve ser uma descrição do que o usuário procura (ex: "tinta para quarto sem cheiro", "tinta para muro externo que pega chuva").';

  static tool() {
    console.log("Tool do Tavily chamado com sucesso");

    return new TavilySearch({
      tavilyApiKey: env.TAVILY_API_KEY,
      maxResults: 5,
      topic: "general",
    });
  }
}
