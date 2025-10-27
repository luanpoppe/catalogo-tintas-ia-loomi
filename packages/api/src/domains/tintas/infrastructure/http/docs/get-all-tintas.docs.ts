import { RouteShorthandOptions } from "fastify";
import z from "zod";
import { ResponseTintaDTOSchema } from "../dto/tinta.dto";

export const GetAllTintasDocs: RouteShorthandOptions = {
  schema: {
    tags: ["tintas"],
    description: "Obter todas as tintas.",
    response: {
      200: z.array(ResponseTintaDTOSchema).describe("Success"),
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
