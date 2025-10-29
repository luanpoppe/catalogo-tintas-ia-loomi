import z from "zod";

export const AgenteTintaResponseDTOSchema = z.object({
  texto: z
    .string()
    .nonempty()
    .describe("Texto a ser enviado ao usuário final."),
  urlImagem: z
    .optional(z.string())
    .describe(
      "Em caso de uso da tool de geração de imagem, passe a url da imagem gerada aqui. Se esta tool não for utilizada, você nãodeve passar nenhumvalor aqui."
    ),
});
