import z from "zod";

export const RecursoNaoEncontradoDocs = z
  .object({
    error: z.string(),
  })
  .describe("Recurso não encontrado");
