import { TintaQueryMapper } from "../../infrastructure/mappers/tinta-query.mapper";
import {
  ITintaRepository,
  TintaQuery,
} from "../../domain/repositories/tinta.repository";

export class GetTintasByQueryUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(query: TintaQuery) {
    const tintas = await this.tintaRepository.getByQuery(query);

    const featuresToFilter = Array.isArray(query.features)
      ? query.features
      : query.features
      ? [query.features]
      : [];

    return {
      tintas: TintaQueryMapper.filtraTintasPorFeatures(
        tintas,
        featuresToFilter
      ),
    };
  }
}
