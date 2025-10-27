import { IEncryptInterface } from "@/lib/encrypt/encrypt.interface";
import { RequestUsuarioDTO } from "../../infrastructure/http/dto/usuario.dto";
import { IUsuarioRepository } from "./../../domain/repositories/usuario.repository";
import { PERMISSOES } from "@/generated/prisma/enums";
import { UsuarioSemPremissaoException } from "@/core/exceptions/usuario-sem-premissao.exception";

export class CreateUsuarioUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private encrypt: IEncryptInterface
  ) {}

  async execute(body: RequestUsuarioDTO, tipoDeUsuario?: PERMISSOES) {
    const { senha, ...usuarioBody } = body;

    const isUserAdmin = tipoDeUsuario === "ADMIN";

    if (usuarioBody.tipoUsuario === "ADMIN" && !isUserAdmin) {
      throw new UsuarioSemPremissaoException();
    }

    const senhaHashed = await this.encrypt.hash(senha);

    const bodyComSenhaHashed: RequestUsuarioDTO = {
      ...usuarioBody,
      senha: senhaHashed,
    };

    const usuario = await this.usuarioRepository.create(bodyComSenhaHashed);
    return { usuario };
  }
}
