import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseTintaDTOSchema } from "../dto/tinta.dto";

export const GetTintaByIdDocs: RouteShorthandOptions = {
  schema: {
    tags: ["tintas"],
    description: "Obter uma tinta pelo ID.",
    params: z.object({
      id: z.number().int().positive().describe("ID da tinta"),
    }),
    response: {
      200: ResponseTintaDTOSchema.describe("Success"),
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
