import {
  BuscarTintasPorQueryTool,
  AMBIENTES_SCHEMA,
  TIPOS_DE_SUPERFICIE_SCHEMA,
} from "../buscar-tintas-por-query.tool";
import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";
import z from "zod";

// Mockar a função global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("BuscarTintasPorQueryTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve ter o nome e a descrição corretos", () => {
    expect(BuscarTintasPorQueryTool.name).toBe("buscar_tintas_por_query");
    expect(BuscarTintasPorQueryTool.description).toBe(
      "Use esta ferramenta para encontrar tintas com base em critérios específicos como cor, ambiente, acabamento, características, linha ou tipo de superfície. Forneça os critérios como um objeto JSON."
    );
  });

  describe("call", () => {
    it("deve retornar as tintas formatadas se encontradas", async () => {
      const query = { cor: "azul", ambiente: AMBIENTES_SCHEMA.enum.INTERNO };
      const mockTintas = [
        {
          nome: "Tinta Azul Céu",
          features: ["lavável"],
          acabamento: "FOSCO",
          ambiente: AMBIENTES_SCHEMA.enum.INTERNO,
          cor: "azul",
          linhas: "PREMIUM",
          tiposDeSuperfeicie: [TIPOS_DE_SUPERFICIE_SCHEMA.enum.ALVENARIA],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTintas),
      });

      const result = await BuscarTintasPorQueryTool.call(query);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3333/tinta/search?cor=azul&ambiente=INTERNO"
      );
      expect(result).toContain(
        "Aqui estão as tintas encontradas com base nos seus critérios:"
      );
      expect(result).toContain(
        "- Tinta: Tinta Azul Céu (Cor: azul, Acabamento: FOSCO, Ambiente: INTERNO, Linha: PREMIUM, Features: lavável, Superfícies: ALVENARIA)"
      );
    });

    it("deve retornar uma mensagem de 'nenhuma tinta encontrada' se a busca retornar vazia", async () => {
      const query = { cor: "vermelho" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await BuscarTintasPorQueryTool.call(query);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3333/tinta/search?cor=vermelho"
      );
      expect(result).toBe(
        "Nenhuma tinta foi encontrada com os critérios fornecidos. Tente ajustar os parâmetros da busca."
      );
    });

    it("deve lidar com erros HTTP", async () => {
      const query = { cor: "verde" };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await BuscarTintasPorQueryTool.call(query);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3333/tinta/search?cor=verde"
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao buscar tintas por query:",
        expect.any(Error)
      );
      expect(result).toBe(
        "Ocorreu um erro ao consultar o catálogo de tintas com os critérios fornecidos."
      );
      consoleErrorSpy.mockRestore();
    });

    it("deve lidar com erros de rede", async () => {
      const query = { cor: "amarelo" };

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await BuscarTintasPorQueryTool.call(query);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3333/tinta/search?cor=amarelo"
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao buscar tintas por query:",
        expect.any(Error)
      );
      expect(result).toBe(
        "Ocorreu um erro ao consultar o catálogo de tintas com os critérios fornecidos."
      );
      consoleErrorSpy.mockRestore();
    });

    it("deve formatar corretamente a URL com múltiplos tiposDeSuperfeicie", async () => {
      const query = {
        tiposDeSuperfeicie: [
          TIPOS_DE_SUPERFICIE_SCHEMA.enum.ALVENARIA,
          TIPOS_DE_SUPERFICIE_SCHEMA.enum.MADEIRA,
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await BuscarTintasPorQueryTool.call(query);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3333/tinta/search?tiposDeSuperfeicie=ALVENARIA&tiposDeSuperfeicie=MADEIRA"
      );
    });
  });

  describe("formatarResultado", () => {
    it("deve formatar corretamente uma lista de tintas", () => {
      const tintas = [
        {
          nome: "Tinta A",
          features: ["feature1", "feature2"],
          acabamento: "ACETINADO",
          ambiente: "INTERNO",
          cor: "branco",
          linhas: "STANDARD",
          tiposDeSuperfeicie: ["ALVENARIA"],
        },
        {
          nome: "Tinta B",
          features: ["feature3"],
          acabamento: "FOSCO",
          ambiente: "EXTERNO",
          cor: "preto",
          linhas: "PREMIUM",
          tiposDeSuperfeicie: ["MADEIRA", "FERRO"],
        },
      ];
      const expected =
        "- Tinta: Tinta A (Cor: branco, Acabamento: ACETINADO, Ambiente: INTERNO, Linha: STANDARD, Features: feature1, feature2, Superfícies: ALVENARIA)\n" +
        "- Tinta: Tinta B (Cor: preto, Acabamento: FOSCO, Ambiente: EXTERNO, Linha: PREMIUM, Features: feature3, Superfícies: MADEIRA, FERRO)";

      const formatted = (BuscarTintasPorQueryTool as any).formatarResultado(
        tintas
      );
      expect(formatted).toBe(expected);
    });

    it("deve retornar uma string vazia para uma lista de tintas vazia", () => {
      const tintas: any[] = [];
      const formatted = (BuscarTintasPorQueryTool as any).formatarResultado(
        tintas
      );
      expect(formatted).toBe("");
    });
  });
});
