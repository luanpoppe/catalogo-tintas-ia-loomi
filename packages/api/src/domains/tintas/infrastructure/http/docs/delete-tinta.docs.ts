import { RecursoNaoEncontradoDocs } from "@/core/infrastructure/http/docs/recurso-nao-encontrado.docs";
import { RouteShorthandOptions } from "fastify";
import z from "zod";

export const DeleteTintaDocs: RouteShorthandOptions = {
  schema: {
    tags: ["tintas"],
    description: "Deletar uma tinta pelo ID.",
    params: z.object({
      id: z.coerce.number().int().positive().describe("ID da tinta"),
    }),
    response: {
      204: z.void().describe("No Content"),
      404: RecursoNaoEncontradoDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
