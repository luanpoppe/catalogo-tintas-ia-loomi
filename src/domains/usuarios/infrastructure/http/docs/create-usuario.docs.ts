import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseUsuarioDTOSchema } from "../dto/usuario.dto";

export const CreateUsuarioDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Criar um usuário.",
    response: {
      200: ResponseUsuarioDTOSchema.describe("Successo"),
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
