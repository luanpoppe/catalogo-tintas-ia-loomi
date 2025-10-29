import "dotenv/config";
import fs from "node:fs";
import csvParser from "csv-parser";
import { PrismaClient, Tintas } from "../generated/prisma/client.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const openAiKey = process.env.OPENAI_API_KEY;
if (!openAiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}
const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  openAIApiKey: openAiKey,
});

type TintaInput = Omit<Tintas, "id" | "embedding">;

async function main() {
  await criarUsuarioAdministrador();

  const tintasDoCsv = await lerCsv();

  if (await doesSeedJaFoiFeito(tintasDoCsv))
    return console.log(
      "Tintas do seed já foram adicionadas anteriormente. Pulando esta etapa do seed atual\n"
    );

  if (tintasDoCsv.length === 0)
    return console.log(
      "Nenhuma tinta encontrada no array 'tintasDoCsv'. Adicione os dados do seu CSV para fazer o seed.\n"
    );

  for (const tinta of tintasDoCsv) {
    const { sql } = await gerarEmbeddingESql(tinta);

    await prisma.$executeRawUnsafe(sql);
    console.log(`Tinta "${tinta.nome}" inserida com sucesso.`);
  }
}

async function criarUsuarioAdministrador() {
  const email = "admin@admin.com";
  const senha = "Senha123";
  const senhaHashed = await hash(senha, 6);

  const doesUsuarioExiste = await prisma.usuarios.findFirst({
    where: {
      email,
    },
  });
  if (doesUsuarioExiste)
    return console.log("Usuário administrador já existe\n");

  await prisma.usuarios.create({
    data: {
      email,
      passwordHash: senhaHashed,
      nome: "Administrador",
      tipoUsuario: "ADMIN",
    },
  });
}

async function lerCsv(): Promise<TintaInput[]> {
  const resultados: any[] = [];
  const resultadosFinais: TintaInput[] = [];

  const novosHeaders = [
    "nome",
    "cor",
    "tiposDeSuperfeicie",
    "ambiente",
    "acabamento",
    "features",
    "linhas",
  ];

  return new Promise((resolve, reject) => {
    fs.createReadStream("./prisma/seed-tintas.csv")
      .pipe(
        csvParser({
          headers: novosHeaders,
          skipLines: 1,
        })
      )
      .on("data", (dados) => resultados.push(dados))
      .on("end", () => {
        console.log("Leitura e mapeamento concluídos!\n");
        resultados.forEach((t) => {
          resultadosFinais.push({
            ...t,
            features: t.features.split(" | "),
            tiposDeSuperfeicie: t.tiposDeSuperfeicie.split(" | "),
          });
        });
        resolve(resultadosFinais);
      });
  });
}

async function doesSeedJaFoiFeito(tintas: TintaInput[]) {
  const tinta = await prisma.tintas.findFirst({
    where: {
      nome: tintas[0].nome,
      ambiente: tintas[0].ambiente,
    },
  });

  if (tinta) return true;
  return false;
}

async function gerarEmbeddingESql(tinta: TintaInput) {
  // Crie um "documento" para gerar o embedding
  const documento = `
      Nome: ${tinta.nome}, 
      Cor: ${tinta.cor}, 
      Ambiente: ${tinta.ambiente}, 
      Acabamento: ${tinta.acabamento}, 
      Features: ${
        Array.isArray(tinta.features)
          ? tinta.features.join(", ")
          : tinta.features
      }
    `;

  // Gere o embedding (um array de números, ex: [0.1, 0.2, ...])
  const vetor = await embeddings.embedQuery(documento);

  // Converta o array para a string que o Postgres entende: '[0.1, 0.2, ...]'
  const embeddingString = `[${vetor.join(",")}]`;

  // Salve no banco usando $executeRawUnsafe montando SQL para permitir casts corretos
  const escape = (s: string) => String(s).replace(/'/g, "''");
  // Monta literais de array sem aspas externas (ex: {ALVENARIA})
  const tiposLiteral = `{${tinta.tiposDeSuperfeicie
    .map((v: string) => escape(v))
    .join(",")}}`;
  const featuresLiteral = `{${tinta.features
    .map((v: string) => escape(v))
    .join(",")}}`;

  const sql = `
      INSERT INTO "tintas"
        (nome, cor, ambiente, acabamento, features, linhas, "tiposDeSuperfeicie", embedding)
      VALUES (
        '${escape(tinta.nome)}',
        '${escape(tinta.cor)}',
        '${escape(tinta.ambiente)}'::"AMBIENTES",
        '${escape(tinta.acabamento)}'::"ACABAMENTOS",
        '${featuresLiteral}'::text[],
        '${escape(tinta.linhas)}'::"LINHAS",
        '${tiposLiteral}'::"TIPOS_DE_SUPERFICIE"[],
        '${embeddingString}'::vector
      );
    `;

  return { sql };
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
