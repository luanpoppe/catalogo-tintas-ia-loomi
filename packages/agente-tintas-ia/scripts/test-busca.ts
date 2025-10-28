import "dotenv/config";
import { BuscarTintaTool } from "../src/lib/langchain/tools/buscar-tinta.tool";

async function run() {
  const tool = new BuscarTintaTool();
  // Chute de exemplo — ajuste a prompt se quiser testar outro caso
  const input =
    "Preciso de tinta para quarto interno, sem cheiro e fácil de limpar";
  try {
    // _call é protected, então usamos cast para qualquer para invocar
    const result = await (tool as any)._call(input);
    console.log("Resultado da busca:\n", result);
  } catch (err) {
    console.error("Erro ao executar a ferramenta:", err);
    process.exit(1);
  }
}

run();
