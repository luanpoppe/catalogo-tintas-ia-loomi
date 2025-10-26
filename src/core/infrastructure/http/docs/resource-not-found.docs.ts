import z from "zod";

export const ResourceNotFoundDocs = z
  .object({
    error: z.string(),
  })
  .describe("Recurso não encontrado");
