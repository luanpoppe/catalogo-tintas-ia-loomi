import z from "zod";
import { FastifySchema, RouteShorthandOptions } from "fastify";
import { ResponseLoginDTOSchema } from "../dto/login.dto";

const schema: FastifySchema = {
  tags: ["auth"],
  description: "Realizar o refresh do token JWT",
  response: {
    200: ResponseLoginDTOSchema.describe("Successo"),
    500: z
      .object({
        error: z.literal("Unkown Error"),
      })
      .describe("Internal Server Error"),
  },
};

export const RefreshTokenDocs = {
  schema,
};
