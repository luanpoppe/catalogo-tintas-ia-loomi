import { RouteShorthandOptions } from "fastify";
import z from "zod";

export const DeleteUsuarioDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Deletar um usuário pelo ID.",
    params: z.object({
      id: z.coerce.number().describe("ID do usuário"),
    }),
    response: {
      204: z.void().describe("No Content"),
      404: z
        .object({
          error: z.literal("Usuário não encontrado"),
        })
        .describe("Not Found"),
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
