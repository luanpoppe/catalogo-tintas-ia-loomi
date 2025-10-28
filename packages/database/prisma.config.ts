import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import path from "node:path";

const caminho = path.resolve(__dirname, "./.env");
config({ path: caminho });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },
});
