import { config } from "dotenv";
import z from "zod";
import path from "node:path";

const caminhoEnv = path.resolve(__dirname, "../.env");

config({ path: caminhoEnv });

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  DATABASE_URL: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
});

const result = envSchema.safeParse(process.env);

if (!result.success)
  throw new Error(JSON.stringify(z.treeifyError(result.error), undefined, 2));

export const env = result.data;
