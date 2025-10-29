import { config } from "dotenv";
import prisma from "../../index.js";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { Environment } from "vitest/environments";

const caminhoEnv = path.resolve(__dirname, "../../.env");
config({ path: caminhoEnv });

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL)
    throw new Error("Please provide a DATABASE_URL env variable");
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);
  // url.searchParams.set("search_path", `${schema},public`);
  return url.toString();
}

export default <Environment>{
  name: "prisma",
  viteEnvironment: "ssr",

  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    const env = process.env;

    env.DATABASE_URL = databaseUrl;
    env.JWT_SECRET = env.JWT_SECRET ?? "test_jwt_secret";
    env.OPENAI_API_KEY = env.OPENAI_API_KEY ?? "test_openai_key";

    const packagesFolder = path.resolve(__dirname, "../../..");

    const schemaPath = path.resolve(
      packagesFolder,
      "./database/prisma/schema.prisma"
    );

    if (!fs.existsSync(schemaPath))
      throw new Error(`Prisma schema not found at: ${schemaPath}`);

    execSync(`npx prisma migrate deploy --schema="${schemaPath}"`, {
      stdio: "inherit",
    });

    // INSTALAR A EXTENSÃO VECTOR NO SCHEMA DE TESTE
    try {
      await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector`;
      console.log("Extensão vector instalada com sucesso no schema de teste");

      // Garantir que o search_path inclua o schema de teste e o schema public,
      // assim os tipos/operators da extensão pgvector (instalados em public)
      // ficam disponíveis durante os testes.
      await prisma.$executeRawUnsafe(`SET search_path = "${schema}", public`);
    } catch (error) {
      console.error("Erro ao instalar extensão vector:", error);
      throw error;
    }

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );
        await prisma.$disconnect();
      },
    };
  },
};
