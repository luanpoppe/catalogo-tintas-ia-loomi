import { IUsuarioRepository } from "@/domains/usuarios/domain/repositories/usuario.repository";
import { RequestLoginDTO } from "../../infrastructure/http/dto/login.dto";
import { IEncryptInterface } from "@/lib/encrypt/encrypt.interface";

export class LoginUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private encryptService: IEncryptInterface
  ) {}

  async execute({ email, senha }: RequestLoginDTO) {
    const usuario = await this.usuarioRepository.findByEmail(email);

    if (!usuario) throw new Error("Email e/ou senha incorretos.");

    const isSenhaCorreta = await this.encryptService.verify(
      senha,
      usuario.passwordHash
    );

    if (!isSenhaCorreta) throw new Error("Email e/ou senha incorretos.");

    return { usuario };
  }
}
