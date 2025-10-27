import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]),
  GEMINI_API_KEY: z.string().nonempty(),
});

const result = envSchema.safeParse(process.env);

if (!result.success)
  throw new Error(JSON.stringify(z.treeifyError(result.error), undefined, 2));

export const env = result.data;
