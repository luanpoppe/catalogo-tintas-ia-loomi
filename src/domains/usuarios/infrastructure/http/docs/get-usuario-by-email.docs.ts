import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseUsuarioDTOSchema } from "../dto/usuario.dto";

export const GetUsuarioByEmailDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Buscar um usuário pelo email.",
    params: z.object({
      email: z.email().describe("Email do usuário"),
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
