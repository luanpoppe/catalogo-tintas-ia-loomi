import z from "zod";

export const ErroDeValidacaoDocs = z.object({
  error: z.array(
    z
      .object({
        keyword: z.string(),
        instancePath: z.string(),
        schemaPath: z.string(),
        params: z.object(),
        message: z.string().optional(),
      })
      .describe("Bad Request - Erro de validação")
  ),
});
