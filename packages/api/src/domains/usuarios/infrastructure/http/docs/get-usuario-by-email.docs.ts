import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseUsuarioDTOSchema } from "../dto/usuario.dto";
import { RecursoNaoEncontradoDocs } from "@/core/infrastructure/http/docs/recurso-nao-encontrado.docs";

export const GetUsuarioByEmailDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Buscar um usuário pelo email.",
    security: [{ bearerAuth: [] }],
    params: z.object({
      email: z.email().describe("Email do usuário"),
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
