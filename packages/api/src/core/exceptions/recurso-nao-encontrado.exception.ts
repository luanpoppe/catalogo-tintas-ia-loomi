import { BaseException } from "./base.exception";

export class RecursoNaoEncontradoException extends BaseException {
  constructor() {
    super("Recurso buscado não encontrado.");
  }

  statusCode = 404;
}
