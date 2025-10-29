import { RouteShorthandOptions } from "fastify";
import z from "zod";
import {
  RequestTintaDTOSchema,
  ResponseTintaDTOSchema,
} from "../dto/tinta.dto";
import { ErroDeValidacaoDocs } from "@/core/infrastructure/http/docs/erro-de-validacao.docs";
import { RecursoNaoEncontradoDocs } from "@/core/infrastructure/http/docs/recurso-nao-encontrado.docs";

export const UpdateTintaDocs: RouteShorthandOptions = {
  schema: {
    tags: ["tintas"],
    description: "Atualizar uma tinta existente.",
    params: z.object({
      id: z.coerce.number().int().positive().describe("ID da tinta"),
    }),
    body: RequestTintaDTOSchema.partial(),
    response: {
      200: ResponseTintaDTOSchema.describe("Success"),
      400: ErroDeValidacaoDocs,
      404: RecursoNaoEncontradoDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
