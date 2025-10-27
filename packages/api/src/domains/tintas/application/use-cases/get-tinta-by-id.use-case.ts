import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";
import { ITintaRepository } from "../../domain/repositories/tinta.repository";

export class GetTintaByIdUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(id: number) {
    const tinta = await this.tintaRepository.findById(id);

    if (!tinta) throw new RecursoNaoEncontradoException();

    return { tinta };
  }
}
