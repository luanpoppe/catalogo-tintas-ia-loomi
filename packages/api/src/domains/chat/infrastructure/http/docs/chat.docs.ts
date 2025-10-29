import z from "zod";
import { FastifySchema, RouteShorthandOptions } from "fastify";
import { RequestChatDTOSchema, ResponseChatDTOSchema } from "../dto/chat.dto";
import { ErroDeValidacaoDocs } from "@/core/infrastructure/http/docs/erro-de-validacao.docs";

const schema: FastifySchema = {
  tags: ["chat"],
  description: "Realizar o login",
  security: [{ bearerAuth: [] }],
  body: RequestChatDTOSchema,
  response: {
    200: ResponseChatDTOSchema.describe("Successo"),
    400: ErroDeValidacaoDocs,
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
