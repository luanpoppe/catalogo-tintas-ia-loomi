import { IEncryptInterface } from "@/lib/encrypt/encrypt.interface";
import { RequestUsuarioDTO } from "../../infrastructure/http/dto/usuario.dto";
import { IUsuarioRepository } from "./../../domain/repositories/usuario.repository";
import { PERMISSOES } from "@/generated/prisma/enums";
import { UsuarioSemPremissaoException } from "@/core/exceptions/usuario-sem-premissao.exception";
import { FastifyReply } from "fastify";
import { AuthController } from "@/domains/auth/infrastructure/http/controllers/auth.controller";
import { Usuarios } from "@/generated/prisma/client";

export class CreateUsuarioUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private encrypt: IEncryptInterface
  ) {}

  async execute(
    body: RequestUsuarioDTO,
    reply: FastifyReply,
    tipoDeUsuario?: PERMISSOES
  ) {
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

    const { accessToken, refreshToken } = await AuthController.gerarTokensLogin(
      usuario as Usuarios,
      reply
    );

    return { usuario, accessToken, refreshToken };
  }
}
