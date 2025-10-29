import { ListarTodasTintasTool } from "../listar-todas-tintas.tool";
import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";

// Mockar a função global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("ListarTodasTintasTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve ter o nome e a descrição corretos", () => {
    expect(ListarTodasTintasTool.name).toBe("listar_todas_tintas");
    expect(ListarTodasTintasTool.description).toBe(
      "Use esta ferramenta para listar todas as tintas disponíveis no catálogo. Não requer nenhuma entrada."
    );
  });

  describe("call", () => {
    it("deve retornar todas as tintas formatadas se encontradas", async () => {
      const mockTintas = [
        {
          nome: "Tinta Acrílica Standard",
          features: ["lavável"],
          acabamento: "FOSCO",
          ambiente: "INTERNO",
        },
        {
          nome: "Tinta Esmalte Premium",
          features: ["brilho intenso", "secagem rápida"],
          acabamento: "BRILHANTE",
          ambiente: "EXTERNO",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTintas),
      });

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await ListarTodasTintasTool.call();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Tool de listar todas as tintas iniciada"
      );
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3333/tinta");
      expect(result).toContain(
        "Aqui estão todas as tintas disponíveis no catálogo:"
      );
      expect(result).toContain(
        "- Tinta: Tinta Acrílica Standard (Acabamento: FOSCO, Ambiente: INTERNO, Features: lavável)"
      );
      expect(result).toContain(
        "- Tinta: Tinta Esmalte Premium (Acabamento: BRILHANTE, Ambiente: EXTERNO, Features: brilho intenso, secagem rápida)"
      );
      consoleSpy.mockRestore();
    });

    it("deve retornar uma mensagem de 'nenhuma tinta encontrada' se a busca retornar vazia", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await ListarTodasTintasTool.call();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Tool de listar todas as tintas iniciada"
      );
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3333/tinta");
      expect(result).toBe("Nenhuma tinta foi encontrada no catálogo.");
      consoleSpy.mockRestore();
    });

    it("deve lidar com erros HTTP", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await ListarTodasTintasTool.call();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Tool de listar todas as tintas iniciada"
      );
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3333/tinta");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao listar tintas:",
        expect.any(Error)
      );
      expect(result).toBe("Ocorreu um erro ao consultar o catálogo de tintas.");
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("deve lidar com erros de rede", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await ListarTodasTintasTool.call();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Tool de listar todas as tintas iniciada"
      );
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3333/tinta");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao listar tintas:",
        expect.any(Error)
      );
      expect(result).toBe("Ocorreu um erro ao consultar o catálogo de tintas.");
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("formatarResultado", () => {
    it("deve formatar corretamente uma lista de tintas", () => {
      const tintas = [
        {
          nome: "Tinta C",
          features: ["feature4"],
          acabamento: "ACETINADO",
          ambiente: "INTERNO_EXTERNO",
        },
        {
          nome: "Tinta D",
          features: ["feature5", "feature6"],
          acabamento: "FOSCO",
          ambiente: "INTERNO",
        },
      ];
      const expected =
        "- Tinta: Tinta C (Acabamento: ACETINADO, Ambiente: INTERNO_EXTERNO, Features: feature4)\n" +
        "- Tinta: Tinta D (Acabamento: FOSCO, Ambiente: INTERNO, Features: feature5, feature6)";

      const formatted = (ListarTodasTintasTool as any).formatarResultado(
        tintas
      );
      expect(formatted).toBe(expected);
    });

    it("deve retornar uma string vazia para uma lista de tintas vazia", () => {
      const tintas: any[] = [];
      const formatted = (ListarTodasTintasTool as any).formatarResultado(
        tintas
      );
      expect(formatted).toBe("");
    });
  });
});
