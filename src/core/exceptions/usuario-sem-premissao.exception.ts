import { BaseException } from "./base.exception";

export class UsuarioSemPremissaoException extends BaseException {
  constructor() {
    super("Acesso não permitido.");
  }

  statusCode = 403;
}
