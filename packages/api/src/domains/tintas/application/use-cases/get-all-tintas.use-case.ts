import { ITintaRepository } from "../../domain/repositories/tinta.repository";

export class GetAllTintasUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute() {
    const tintas = await this.tintaRepository.findAll();

    return { tintas };
  }
}
