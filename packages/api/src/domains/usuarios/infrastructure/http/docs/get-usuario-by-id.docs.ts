import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseUsuarioDTOSchema } from "../dto/usuario.dto";
import { RecursoNaoEncontradoDocs } from "@/core/infrastructure/http/docs/recurso-nao-encontrado.docs";

export const GetUsuarioByIdDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Buscar um usuário pelo ID.",
    security: [{ bearerAuth: [] }],
    params: z.object({
      id: z.coerce.number().describe("ID do usuário"),
    }),
    response: {
      200: ResponseUsuarioDTOSchema.describe("Successo"),
      404: RecursoNaoEncontradoDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
