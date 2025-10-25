import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseUsuarioDTOSchema } from "../dto/usuario.dto";

export const GetUsuarioByIdDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Buscar um usuário pelo ID.",
    params: z.object({
      id: z.coerce.number().describe("ID do usuário"),
    }),
    response: {
      200: ResponseUsuarioDTOSchema.describe("Successo"),
      404: z
        .object({
          error: z.literal("Usuário não encontrado"),
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
