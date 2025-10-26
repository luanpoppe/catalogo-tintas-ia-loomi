import z from "zod";
import { RouteShorthandOptions } from "fastify";
import { ResponseLoginDTOSchema } from "../dto/login.dto";

export const RefreshTokenDocs: RouteShorthandOptions = {
  schema: {
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
  },
};
