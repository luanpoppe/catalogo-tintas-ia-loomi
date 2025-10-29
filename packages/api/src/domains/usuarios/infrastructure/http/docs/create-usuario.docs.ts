import z from "zod";
import { RouteShorthandOptions } from "fastify";
import {
  RequestUsuarioDTOSchema,
  ResponseCreateUsuarioDTOSchema,
} from "../dto/usuario.dto";
import { ErroDeValidacaoDocs } from "@/core/infrastructure/http/docs/erro-de-validacao.docs";
import { UsuarioSemPermissaoDocs } from "@/core/infrastructure/http/docs/usuario-sem-premissao.docs";

export const CreateUsuarioDocs: RouteShorthandOptions = {
  schema: {
    tags: ["usuarios"],
    description: "Criar um usuário.",
    body: RequestUsuarioDTOSchema,
    response: {
      201: ResponseCreateUsuarioDTOSchema.describe("Successo"),
      400: ErroDeValidacaoDocs,
      403: UsuarioSemPermissaoDocs,
      500: z
        .object({
          error: z.literal("Unkown Error"),
        })
        .describe("Internal Server Error"),
    },
  },
};
