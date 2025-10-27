import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";
import { ITintaRepository } from "../../domain/repositories/tinta.repository";

export class DeleteTintaUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(id: number) {
    const doesExist = await this.tintaRepository.doesIdExist(id);
    if (!doesExist) throw new RecursoNaoEncontradoException();

    await this.tintaRepository.delete(id);
  }
}
