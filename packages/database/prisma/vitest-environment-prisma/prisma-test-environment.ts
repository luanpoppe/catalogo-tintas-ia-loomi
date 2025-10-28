import "dotenv/config";
import prisma from "../../index.js";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { Environment } from "vitest/environments";

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL)
    throw new Error("Please provide a DATABASE_URL env variable");
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);
  return url.toString();
}

export default <Environment>{
  name: "prisma",
  viteEnvironment: "node",
  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    const env = process.env;

    env.DATABASE_URL = databaseUrl;
    env.JWT_SECRET = env.JWT_SECRET ?? "test_jwt_secret";
    env.OPENAI_API_KEY = env.OPENAI_API_KEY ?? "test_openai_key";

    const packagesFolder = path.resolve(__dirname, "../../../..");

    const schemaPath = path.resolve(
      packagesFolder,
      "./database/prisma/schema.prisma"
    );

    console.log({ schemaPath });

    if (!fs.existsSync(schemaPath))
      throw new Error(`Prisma schema not found at: ${schemaPath}`);

    execSync(`npx prisma migrate deploy --schema="${schemaPath}"`, {
      stdio: "inherit",
    });

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
