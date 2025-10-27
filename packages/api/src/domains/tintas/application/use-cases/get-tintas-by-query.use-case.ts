import {
  ITintaRepository,
  TintaQuery,
} from "../../domain/repositories/tinta.repository";

export class GetTintasByQueryUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(query: TintaQuery) {
    const tintas = await this.tintaRepository.getByQuery(query);

    return { tintas };
  }
}
