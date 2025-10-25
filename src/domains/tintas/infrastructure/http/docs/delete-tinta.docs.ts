import { RouteShorthandOptions } from "fastify";
import z from "zod";

export const DeleteTintaDocs: RouteShorthandOptions = {
  schema: {
    tags: ["tintas"],
    description: "Deletar uma tinta pelo ID.",
    params: z.object({
      id: z.number().int().positive().describe("ID da tinta"),
    }),
    response: {
      204: z.void().describe("No Content"),
      404: z
        .object({
          message: z.literal("Tinta não encontrada."),
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
