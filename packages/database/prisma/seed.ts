import "dotenv/config";
import { PrismaClient, Tintas } from "../generated/prisma/client";
import { OpenAIEmbeddings } from "@langchain/openai";
// TODO: Se preferir ler de CSV, substitua o array abaixo pela leitura do arquivo.

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
  // Exemplo mínimo de dados — substitua por leitura do seu CSV se preferir
  const tintasDoCsv: TintaInput[] = [
    {
      nome: "Tinta Exemplo",
      cor: "Branco",
      ambiente: "INTERNO",
      acabamento: "FOSCO",
      features: ["Sem Cheiro", "Limpável"],
      linhas: "PREMIUM",
      tiposDeSuperfeicie: ["ALVENARIA"],
    },
  ];

  if (tintasDoCsv.length === 0) {
    console.log(
      "Nenhuma tinta encontrada no array 'tintasDoCsv'. Adicione os dados do seu CSV para fazer o seed."
    );
    return;
  }

  for (const tinta of tintasDoCsv) {
    // 2. Crie um "documento" para gerar o embedding
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

    // 3. Gere o embedding (um array de números, ex: [0.1, 0.2, ...])
    const vetor = await embeddings.embedQuery(documento);

    // 4. Converta o array para a string que o Postgres entende: '[0.1, 0.2, ...]'
    const embeddingString = `[${vetor.join(",")}]`;

    // 5. Salve no banco usando $executeRawUnsafe montando SQL para permitir casts corretos
    const escape = (s: string) => String(s).replace(/'/g, "''");
    // Monta literais de array sem aspas externas (ex: {ALVENARIA})
    const tiposLiteral = `{${tinta.tiposDeSuperfeicie
      .map((v) => escape(v))
      .join(",")}}`;
    const featuresLiteral = `{${tinta.features
      .map((v) => escape(v))
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

    await prisma.$executeRawUnsafe(sql);
    console.log(`Tinta "${tinta.nome}" inserida com sucesso.`);
  }
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
