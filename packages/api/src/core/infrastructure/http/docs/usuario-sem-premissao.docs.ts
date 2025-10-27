import z from "zod";

export const UsuarioSemPermissaoDocs = z
  .object({
    error: z.string(),
  })
  .describe("Usuário sem permissão");
