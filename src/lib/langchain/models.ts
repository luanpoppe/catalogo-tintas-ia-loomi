import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIChatInput,
} from "@langchain/google-genai";
import { env } from "../../env";

export enum GEMINI_MODELS {
  FLASH_2_5 = "gemini-2.5-flash",
  FLASH_LITE_2_5 = "gemini-2.5-flash-lite",
  PRO_2_5 = "gemini-2.5-pro",
}

export class LangchainModels {
  static gemini(options?: GoogleGenerativeAIChatInput) {
    const model = new ChatGoogleGenerativeAI({
      ...options,
      model: options?.model ?? GEMINI_MODELS.FLASH_2_5,
      maxOutputTokens: options?.maxOutputTokens ?? 2048,
      apiKey: env.GEMINI_API_KEY,
    });

    return model;
  }
}
