import { BuscarTintaTool } from "../buscar-tinta.tool";
import prisma from "@catalogo-tintas/database";
import { OpenAIEmbeddings } from "@langchain/openai";
import { env } from "../../../../env";
import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";

// Mockar as dependências
vi.mock("@catalogo-tintas/database", () => ({
  default: {
    $queryRaw: vi.fn(),
    $executeRawUnsafe: vi.fn(),
  },
}));

vi.mock("@langchain/openai", () => {
  const mockEmbedQuery = vi.fn();
  const mockOpenAIEmbeddingsInstance = {
    embedQuery: mockEmbedQuery,
  };
  return {
    OpenAIEmbeddings: vi.fn(() => mockOpenAIEmbeddingsInstance),
  };
});

vi.mock("../../../../env", () => ({
  env: {
    OPENAI_API_KEY: "mock-openai-api-key",
  },
}));

describe("BuscarTintaTool", () => {
  let mockPrismaQueryRaw: Mocked<any>;
  let mockPrismaExecuteRawUnsafe: Mocked<any>;
  let mockEmbedQueryFn: Mocked<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaQueryRaw = prisma.$queryRaw as Mocked<any>;
    mockPrismaExecuteRawUnsafe = prisma.$executeRawUnsafe as Mocked<any>;

    const openAIEmbeddingsInstance = new OpenAIEmbeddings({});
    mockEmbedQueryFn = openAIEmbeddingsInstance.embedQuery as Mocked<any>;

    mockEmbedQueryFn.mockResolvedValue([0.1, 0.2, 0.3]);
    mockPrismaQueryRaw.mockResolvedValue([]); // Por padrão, nenhuma tinta encontrada
    mockPrismaExecuteRawUnsafe.mockResolvedValue(undefined); // Mock para $executeRawUnsafe
  });

  it("deve ter o nome e a descrição corretos", () => {
    expect(BuscarTintaTool.name).toBe("buscar_tintas_suvinil");
    expect(BuscarTintaTool.description).toBe(
      'Use esta ferramenta para encontrar tintas Suvinil com base nas necessidades, contexto ou preferências do usuário. A entrada deve ser uma descrição do que o usuário procura (ex: "tinta para quarto sem cheiro", "tinta para muro externo que pega chuva").'
    );
  });

  describe("call", () => {
    it("deve retornar uma mensagem de 'nenhuma tinta encontrada' se a busca retornar vazia", async () => {
      const input = "tinta para parede";
      mockPrismaQueryRaw.mockResolvedValue([]);

      const result = await BuscarTintaTool.call(input);

      expect(mockEmbedQueryFn).toHaveBeenCalledWith(input);
      expect(mockPrismaQueryRaw).toHaveBeenCalled();
      expect(result).toBe(
        "Nenhuma tinta foi encontrada com essas especificações. Peça ao usuário para tentar descrever de outra forma."
      );
    });

    it("deve retornar as tintas formatadas se encontradas", async () => {
      const input = "tinta para quarto";
      const mockTintas = [
        {
          nome: "Tinta Acrílica Premium",
          features: ["sem cheiro", "lavável"],
          acabamento: "fosco",
          ambiente: "interno",
        },
      ];
      mockPrismaQueryRaw.mockResolvedValue(mockTintas);

      const result = await BuscarTintaTool.call(input);

      expect(mockEmbedQueryFn).toHaveBeenCalledWith(input);
      expect(mockPrismaQueryRaw).toHaveBeenCalled();
      expect(result).toContain(
        "Aqui estão as tintas mais relevantes encontradas na base de dados:"
      );
      expect(result).toContain(
        "- Tinta: Tinta Acrílica Premium (Acabamento: fosco, Ambiente: interno, Features: sem cheiro, lavável)"
      );
    });

    it("deve lidar com erros durante a busca de tintas", async () => {
      const input = "tinta com erro";
      mockEmbedQueryFn.mockRejectedValue(new Error("Erro de embedding"));
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await BuscarTintaTool.call(input);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao buscar tintas:",
        expect.any(Error)
      );
      expect(result).toBe(
        "Ocorreu um erro ao consultar a base de dados de tintas."
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("formatarResultado", () => {
    it("deve formatar corretamente uma lista de tintas", () => {
      const tintas = [
        {
          nome: "Tinta A",
          features: ["feature1", "feature2"],
          acabamento: "brilhante",
          ambiente: "externo",
        },
        {
          nome: "Tinta B",
          features: ["feature3"],
          acabamento: "acetinado",
          ambiente: "interno",
        },
      ];
      const expected =
        "- Tinta: Tinta A (Acabamento: brilhante, Ambiente: externo, Features: feature1, feature2)\n" +
        "- Tinta: Tinta B (Acabamento: acetinado, Ambiente: interno, Features: feature3)";

      const formatted = (BuscarTintaTool as any).formatarResultado(tintas);
      expect(formatted).toBe(expected);
    });

    it("deve retornar uma string vazia para uma lista de tintas vazia", () => {
      const tintas: any[] = [];
      const formatted = (BuscarTintaTool as any).formatarResultado(tintas);
      expect(formatted).toBe("");
    });
  });

  describe("buscarTintasRelevantes", () => {
    it("deve chamar prisma.$queryRaw com os parâmetros corretos", async () => {
      const queryEmbedding = [0.1, 0.2, 0.3];
      const qtdResultados = 2;
      const expectedEmbeddingString = `[${queryEmbedding.join(",")}]`;

      await (BuscarTintaTool as any).buscarTintasRelevantes(
        queryEmbedding,
        qtdResultados
      );

      expect(mockPrismaExecuteRawUnsafe).toHaveBeenCalledWith(
        "SET search_path = public"
      );
      expect(mockPrismaQueryRaw).toHaveBeenCalledWith(
        expect.any(Object), // Template string literal
        expectedEmbeddingString,
        qtdResultados
      );
    });
  });
});
