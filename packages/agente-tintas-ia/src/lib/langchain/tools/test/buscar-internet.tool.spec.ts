import { BuscarInternetTool } from "../buscar-internet.tool";
import { TavilySearch } from "@langchain/tavily";
import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";

vi.mock("@langchain/tavily", () => {
  const mockTavilySearch = vi.fn(function (this: any) {
    this.invoke = vi.fn();
  });
  return {
    TavilySearch: mockTavilySearch,
  };
});

vi.mock("../../../../env", () => ({
  env: {
    TAVILY_API_KEY: "mock-tavily-api-key",
  },
}));

describe("BuscarInternetTool", () => {
  let mockTavilySearch: Mocked<TavilySearch>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockTavilySearch = new TavilySearch({
      tavilyApiKey: "mock-tavily-api-key",
    }) as Mocked<TavilySearch>;
  });

  it("deve ter o nome e a descrição corretos", () => {
    expect(BuscarInternetTool.name).toBe("buscar_na_internet");
    expect(BuscarInternetTool.description).toBe(
      'Use esta ferramenta para encontrar tintas Suvinil com base nas necessidades, contexto ou preferências do usuário. A entrada deve ser uma descrição do que o usuário procura (ex: "tinta para quarto sem cheiro", "tinta para muro externo que pega chuva").'
    );
  });

  it("deve retornar uma instância de TavilySearch com as configurações corretas", () => {
    const consoleSpy = vi.spyOn(console, "log");
    const toolInstance = BuscarInternetTool.tool();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Tool do Tavily chamado com sucesso"
    );
    expect(TavilySearch).toHaveBeenCalledWith({
      tavilyApiKey: "mock-tavily-api-key",
      maxResults: 5,
      topic: "general",
    });

    console.log({ toolInstance });

    expect(toolInstance).toBeInstanceOf(TavilySearch);
    consoleSpy.mockRestore();
  });
});
