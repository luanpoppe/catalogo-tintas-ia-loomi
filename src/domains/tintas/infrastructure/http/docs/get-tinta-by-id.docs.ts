import z from "zod";
import { RouteShorthandOptions } from "fastify";
import { ResponseTintaDTOSchema } from "../dto/tinta.dto";
import { RecursoNaoEncontradoDocs } from "@/core/infrastructure/http/docs/recurso-nao-encontrado.docs";

export const GetTintaByIdDocs: RouteShorthandOptions = {
  schema: {
    tags: ["tintas"],
    description: "Obter uma tinta pelo ID.",
    params: z.object({
      id: z.number().int().positive().describe("ID da tinta"),
    }),
    response: {
      200: ResponseTintaDTOSchema.describe("Success"),
      404: RecursoNaoEncontradoDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
