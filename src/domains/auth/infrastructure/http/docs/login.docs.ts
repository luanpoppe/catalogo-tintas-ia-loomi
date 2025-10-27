import z from "zod";
import { FastifySchema } from "fastify";
import {
  RequestLoginDTOSchema,
  ResponseLoginDTOSchema,
} from "../dto/login.dto";

const schema: FastifySchema = {
  tags: ["auth"],
  description: "Realizar o login",
  body: RequestLoginDTOSchema,
  response: {
    200: ResponseLoginDTOSchema.describe("Successo"),
    401: z.object({ error: z.string() }).describe("Login inválido"),
    500: z
      .object({
        error: z.literal("Unkown Error"),
      })
      .describe("Internal Server Error"),
  },
};

export const LoginDocs = {
  schema,
};
