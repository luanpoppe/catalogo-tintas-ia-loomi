import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseTintaDTOSchema } from "../dto/tinta.dto";
import { ValidationDocs } from "@/core/infrastructure/http/docs/validation.docs";

export const CreateTintaDocs: RouteShorthandOptions = {
  schema: {
    tags: ["tintas"],
    description: "Criar uma tinta.",
    response: {
      200: ResponseTintaDTOSchema.describe("Successo"),
      400: ValidationDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
