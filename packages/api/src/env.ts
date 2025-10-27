import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["dev", "prod", "test"]),
  DATABASE_URL: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
});

const result = envSchema.safeParse(process.env);

if (!result.success)
  throw new Error(JSON.stringify(z.treeifyError(result.error), undefined, 2));

export const env = result.data;
