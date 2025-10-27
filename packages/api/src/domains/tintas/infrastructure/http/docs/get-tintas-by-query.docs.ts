import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseTintaDTOSchema } from "../dto/tinta.dto";
import {
  ACABAMENTOS_SCHEMA,
  AMBIENTES_SCHEMA,
  LINHAS_SCHEMA,
  TIPOS_DE_SUPERFICIE_SCHEMA,
} from "../../../domain/entities/tintas.entity";

export const GetTintasByQueryDocs: RouteShorthandOptions = {
  schema: {
    tags: ["tintas"],
    description: "Obter tintas por query.",
    querystring: z.object({
      cor: z.string().optional().describe("Cor da tinta"),
      ambiente: AMBIENTES_SCHEMA.optional().describe("Ambiente da tinta"),
      acabamento: ACABAMENTOS_SCHEMA.optional().describe("Acabamento da tinta"),
      features: z
        .array(z.string())
        .optional()
        .describe("Características da tinta"),
      linhas: LINHAS_SCHEMA.optional().describe("Linha da tinta"),
      tiposDeSuperfeicie: z
        .array(TIPOS_DE_SUPERFICIE_SCHEMA)
        .optional()
        .describe("Tipos de superfície da tinta"),
    }),
    response: {
      200: z.array(ResponseTintaDTOSchema).describe("Success"),
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
