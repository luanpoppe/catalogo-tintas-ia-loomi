import { IEncryptInterface } from "@/lib/encrypt/encrypt.interface";
import { RequestUsuarioDTO } from "../../infrastructure/http/dto/usuario.dto";
import { IUsuarioRepository } from "./../../domain/repositories/usuario.repository";

export class CreateUsuarioUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private encrypt: IEncryptInterface
  ) {}

  async execute(body: RequestUsuarioDTO) {
    const { senha, ...rest } = body;
    const senhaHashed = await this.encrypt.hash(senha);

    const bodyComSenhaHashed: RequestUsuarioDTO = {
      ...rest,
      senha: senhaHashed,
    };

    const usuario = await this.usuarioRepository.create(bodyComSenhaHashed);
    return { usuario };
  }
}
