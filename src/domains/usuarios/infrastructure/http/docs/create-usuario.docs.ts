import z from "zod";
import { RouteShorthandOptions } from "fastify";
import {
  RequestUsuarioDTOSchema,
  ResponseUsuarioDTOSchema,
} from "../dto/usuario.dto";
import { ErroDeValidacaoDocs } from "@/core/infrastructure/http/docs/erro-de-validacao.docs";

export const CreateUsuarioDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Criar um usuário.",
    body: RequestUsuarioDTOSchema,
    response: {
      200: ResponseUsuarioDTOSchema.describe("Successo"),
      400: ErroDeValidacaoDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
