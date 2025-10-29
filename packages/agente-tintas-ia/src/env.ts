import z from "zod";
import path from "node:path";
import { config } from "dotenv";

const caminhoEnv = path.resolve(__dirname, "../.env");
config({ path: caminhoEnv });

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]),
  GEMINI_API_KEY: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  OPENAI_API_KEY: z.string().nonempty(),
  TAVILY_API_KEY: z.string().nonempty(),
});

const result = envSchema.safeParse(process.env);

if (!result.success)
  throw new Error(JSON.stringify(z.treeifyError(result.error), undefined, 2));

export const env = result.data;
