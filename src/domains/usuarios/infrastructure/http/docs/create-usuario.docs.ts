import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseUsuarioDTOSchema } from "../dto/usuario.dto";
import { ValidationDocs } from "@/core/infrastructure/http/docs/validation.docs";

export const CreateUsuarioDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Criar um usuário.",
    response: {
      200: ResponseUsuarioDTOSchema.describe("Successo"),
      400: ValidationDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
