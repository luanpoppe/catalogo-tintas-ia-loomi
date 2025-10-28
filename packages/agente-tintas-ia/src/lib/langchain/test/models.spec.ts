import { LangchainModels, GEMINI_MODELS } from "../models";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { env } from "../../../env";
import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";

vi.mock("@langchain/google-genai", async (importOriginal) => {
  const actual = (await importOriginal()) as {
    ChatGoogleGenerativeAI: typeof ChatGoogleGenerativeAI;
  };
  return {
    ChatGoogleGenerativeAI: vi.fn(() =>
      Object.assign(vi.fn(), {
        prototype: actual.ChatGoogleGenerativeAI.prototype,
      })()
    ),
  };
});

vi.mock("@langchain/openai", async (importOriginal) => {
  const actual = (await importOriginal()) as {
    ChatOpenAI: typeof ChatOpenAI;
  };
  return {
    ChatOpenAI: vi.fn(() =>
      Object.assign(vi.fn(), {
        prototype: actual.ChatOpenAI.prototype,
      })()
    ),
  };
});

vi.mock("../../../env", () => ({
  env: {
    GEMINI_API_KEY: "mock-gemini-api-key",
    OPENAI_API_KEY: "mock-openai-api-key",
  },
}));

describe("LangchainModels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("gemini", () => {
    it("deve criar uma instância de ChatGoogleGenerativeAI com opções padrão", () => {
      const model = LangchainModels.gemini();

      expect(ChatGoogleGenerativeAI).toHaveBeenCalledWith({
        model: GEMINI_MODELS.FLASH_2_5,
        maxOutputTokens: 2048,
        apiKey: env.GEMINI_API_KEY,
      });
      expect(model).toBeInstanceOf(ChatGoogleGenerativeAI);
    });

    it("deve criar uma instância de ChatGoogleGenerativeAI com opções personalizadas", () => {
      const customOptions = {
        model: GEMINI_MODELS.PRO_2_5,
        maxOutputTokens: 1024,
        temperature: 0.5,
      };
      const model = LangchainModels.gemini(customOptions);

      expect(ChatGoogleGenerativeAI).toHaveBeenCalledWith({
        ...customOptions,
        apiKey: env.GEMINI_API_KEY,
      });
      expect(model).toBeInstanceOf(ChatGoogleGenerativeAI);
    });
  });

  describe("openAI", () => {
    it("deve criar uma instância de ChatOpenAI com opções padrão", () => {
      const model = LangchainModels.openAI();

      expect(ChatOpenAI).toHaveBeenCalledWith({
        model: "gpt-4o",
        temperature: 0.8,
        maxTokens: 2048,
        apiKey: env.OPENAI_API_KEY,
      });
      expect(model).toBeInstanceOf(ChatOpenAI);
    });

    it("deve criar uma instância de ChatOpenAI com opções personalizadas", () => {
      const customOptions = {
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        maxTokens: 1024,
      };
      const model = LangchainModels.openAI(customOptions as any);

      expect(ChatOpenAI).toHaveBeenCalledWith({
        ...customOptions,
        apiKey: env.OPENAI_API_KEY,
      });
      expect(model).toBeInstanceOf(ChatOpenAI);
    });
  });
});
