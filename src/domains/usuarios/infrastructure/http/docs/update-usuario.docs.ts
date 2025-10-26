import { RouteShorthandOptions } from "fastify";
import z from "zod";
import {
  RequestUsuarioDTOSchema,
  ResponseUsuarioDTOSchema,
} from "../dto/usuario.dto";

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
