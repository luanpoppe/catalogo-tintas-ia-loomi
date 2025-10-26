import { RouteShorthandOptions } from "fastify";
import z from "zod";
import {
  RequestUsuarioDTOSchema,
  ResponseUsuarioDTOSchema,
} from "../dto/usuario.dto";
import { RecursoNaoEncontradoDocs } from "@/core/infrastructure/http/docs/recurso-nao-encontrado.docs";
import { ValidationDocs } from "@/core/infrastructure/http/docs/validation.docs";

export const UpdateUsuarioDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Atualizar um usuário pelo ID.",
    params: z.object({
      id: z.coerce.number().describe("ID do usuário"),
    }),
    body: RequestUsuarioDTOSchema,
    response: {
      200: ResponseUsuarioDTOSchema.describe("Successo"),
      400: ValidationDocs,
      404: RecursoNaoEncontradoDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
