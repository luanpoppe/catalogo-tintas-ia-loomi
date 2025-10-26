import z, { ZodError } from "zod";
import { FastifyError, FastifyReply } from "fastify";
import { BaseException } from "./base.exception";
import { env } from "@/env";

export class ExceptionHandler {
  static execute(error: FastifyError, reply: FastifyReply) {
    console.log({ error });

    if (error.validation) {
      console.log({ errorValidation: error.validation });
      return reply.status(400).send({ error: error.validation });
    }

    if (error instanceof BaseException) {
      return reply.status(error.statusCode).send({ error: error.message });
    } else if (error instanceof ZodError)
      return reply.status(400).send(z.treeifyError(error));

    const isProd = env.NODE_ENV === "prod";
    const message = isProd ? "Unknow Error" : error.message;

    return reply.status(500).send({ error: message });
  }
}
