import { BaseException } from "./base.exception";

export class ResourceNotFoundException extends BaseException {
  constructor() {
    super("Recurso buscado não encontrado.");
  }

  statusCode = 404;
}
