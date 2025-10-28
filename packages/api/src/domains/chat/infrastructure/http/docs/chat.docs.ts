import z from "zod";
import { FastifySchema, RouteShorthandOptions } from "fastify";
import { RequestChatDTOSchema, ResponseChatDTOSchema } from "../dto/chat.dto";

const schema: FastifySchema = {
  tags: ["auth"],
  description: "Realizar o login",
  body: RequestChatDTOSchema,
  response: {
    200: ResponseChatDTOSchema.describe("Successo"),
    401: z.object({ error: z.string() }).describe("Usuário não logado"),
    500: z
      .object({
        error: z.literal("Unkown Error"),
      })
      .describe("Internal Server Error"),
  },
};
export const ChatDocs: RouteShorthandOptions = {
  schema,
};
