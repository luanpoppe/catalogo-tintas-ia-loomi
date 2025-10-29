import { GerarImagemTintaTool } from "../gerar-imagem-tinta.tool";
import OpenAI from "openai";
import { env } from "../../../../env";
import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";

// Mockar as dependências
vi.mock("openai", () => {
  const mockGenerate = vi.fn();
  const mockOpenAIInstance = {
    images: {
      generate: mockGenerate,
    },
  };
  return {
    default: vi.fn(() => mockOpenAIInstance),
  };
});

vi.mock("../../../../env", () => ({
  env: {
    OPENAI_API_KEY: "mock-openai-api-key",
  },
}));

describe("GerarImagemTintaTool", () => {
  let mockOpenAIGenerate: Mocked<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    const openaiInstance = new OpenAI({});
    mockOpenAIGenerate = openaiInstance.images.generate as Mocked<any>;
  });

  it("deve ter o nome e a descrição corretos", () => {
    expect(GerarImagemTintaTool.name).toBe("gerar_imagem_tinta");
    expect(GerarImagemTintaTool.description).toBe(
      "Use esta ferramenta para gerar uma imagem de um ambiente com uma tinta específica aplicada, utilizando IA. A entrada deve ser uma descrição detalhada do ambiente e da cor da tinta."
    );
  });

  describe("call", () => {
    it("deve retornar a URL da imagem se a geração for bem-sucedida", async () => {
      const input = {
        descricao: "Um quarto moderno com paredes pintadas de azul claro.",
      };
      const mockImageUrl = "http://mock-image-url.com/image.png";

      mockOpenAIGenerate.mockResolvedValueOnce({
        data: [{ url: mockImageUrl }],
      });

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await GerarImagemTintaTool.call(input);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Tool de gerar imagem de tinta iniciada com:",
        input.descricao
      );
      expect(mockOpenAIGenerate).toHaveBeenCalledWith({
        model: "dall-e-3",
        prompt: `Crie uma imagem de um ambiente com a seguinte descrição, aplicando a tinta mencionada: ${input.descricao}. A imagem deve ser realista e de alta qualidade.`,
        n: 1,
        size: "1024x1024",
      });
      expect(result).toEqual({
        texto: `Imagem gerada com sucesso para a descrição: "${input.descricao}".`,
        imageUrl: mockImageUrl,
      });
      consoleSpy.mockRestore();
    });

    it("deve retornar uma mensagem de falha se a URL da imagem não for retornada", async () => {
      const input = {
        descricao: "Um quarto moderno com paredes pintadas de azul claro.",
      };

      mockOpenAIGenerate.mockResolvedValueOnce({
        data: [{}], // Sem URL
      });

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await GerarImagemTintaTool.call(input);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Tool de gerar imagem de tinta iniciada com:",
        input.descricao
      );
      expect(result).toEqual({
        texto: `Não foi possível gerar a imagem para a descrição: "${input.descricao}".`,
      });
      consoleSpy.mockRestore();
    });

    it("deve lidar com erros durante a chamada da API OpenAI", async () => {
      const input = { descricao: "Descrição com erro" };
      const errorMessage = "Erro na API OpenAI";

      mockOpenAIGenerate.mockRejectedValueOnce(new Error(errorMessage));

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await GerarImagemTintaTool.call(input);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Tool de gerar imagem de tinta iniciada com:",
        input.descricao
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao gerar imagem de tinta:",
        expect.any(Error)
      );
      expect(result).toEqual({
        texto: "Ocorreu um erro ao gerar a imagem de tinta.",
      });
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
