import { tool } from "@langchain/core/tools";
import z from "zod";
import OpenAI from "openai";
import { env } from "../../../env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const GerarImagemTintaSchema = z.object({
  descricao: z
    .string()
    .nonempty()
    .describe(
      "Uma descrição detalhada do ambiente e da tinta a ser aplicada, por exemplo: 'Um quarto moderno com paredes pintadas de azul claro, com uma cama e uma janela grande.'"
    ),
});

type GerarImagemTintaOutput = {
  texto: string;
  imageUrl?: string;
};

export class GerarImagemTintaTool {
  static name = "gerar_imagem_tinta";
  static description =
    "Use esta ferramenta para gerar uma imagem de um ambiente com uma tinta específica aplicada, utilizando IA. A entrada deve ser uma descrição detalhada do ambiente e da cor da tinta.";

  static tool() {
    return tool(
      async (
        input: z.infer<typeof GerarImagemTintaSchema>
      ): Promise<GerarImagemTintaOutput> =>
        await GerarImagemTintaTool.call(input),
      {
        name: GerarImagemTintaTool.name,
        description: GerarImagemTintaTool.description,
        schema: GerarImagemTintaSchema,
      }
    );
  }

  static async call(
    input: z.infer<typeof GerarImagemTintaSchema>
  ): Promise<GerarImagemTintaOutput> {
    try {
      console.log(
        "Tool de gerar imagem de tinta iniciada com:",
        input.descricao
      );

      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Crie uma imagem de um ambiente com a seguinte descrição, aplicando a tinta mencionada: ${input.descricao}. A imagem deve ser realista e de alta qualidade.`,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = image.data?.[0]?.url;

      if (imageUrl) {
        return {
          texto: `Imagem gerada com sucesso para a descrição: "${input.descricao}".`,
          imageUrl: imageUrl,
        };
      } else {
        return {
          texto: `Não foi possível gerar a imagem para a descrição: "${input.descricao}".`,
        };
      }
    } catch (error) {
      console.error("Erro ao gerar imagem de tinta:", error);
      return {
        texto: "Ocorreu um erro ao gerar a imagem de tinta.",
      };
    }
  }
}
