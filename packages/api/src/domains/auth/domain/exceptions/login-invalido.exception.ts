import { BaseException } from "@/core/exceptions/base.exception";

export class LoginInvalidoException extends BaseException {
  constructor() {
    super("Email e/ou senha incorretos.");
  }

  statusCode = 401;
}
