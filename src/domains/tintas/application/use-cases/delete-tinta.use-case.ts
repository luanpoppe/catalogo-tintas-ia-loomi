import { ITintaRepository } from "../../domain/repositories/tinta.repository";

export class DeleteTintaUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(id: number) {
    await this.tintaRepository.delete(id);
  }
}
