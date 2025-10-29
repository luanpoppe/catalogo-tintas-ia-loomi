import z, { ZodError } from "zod";
import { FastifyError, FastifyReply } from "fastify";
import { BaseException } from "./base.exception";
import { env } from "@/env";
import { isResponseSerializationError } from "fastify-type-provider-zod";

export class ExceptionHandler {
  static execute(error: FastifyError, reply: FastifyReply) {
    console.log({ error });

    const isProd = env.NODE_ENV === "prod";

    if (isResponseSerializationError(error)) {
      const message = isProd ? "Unknow Error" : error.message;

      return reply.status(500).send({ error: message });
    }

    if (error.validation) {
      console.log({ errorValidation: error.validation });
      return reply.status(400).send({ error: error.validation });
    }

    if (error instanceof BaseException) {
      return reply.status(error.statusCode).send({ error: error.message });
    } else if (error instanceof ZodError)
      return reply.status(400).send(z.treeifyError(error));

    const message = isProd ? "Unknow Error" : error.message;

    return reply.status(500).send({ error: message });
  }
}
