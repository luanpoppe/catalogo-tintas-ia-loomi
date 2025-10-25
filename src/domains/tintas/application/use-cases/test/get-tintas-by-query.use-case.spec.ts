import { describe, it, expect, vi } from "vitest";
import { GetTintasByQueryUseCase } from "../get-tintas-by-query.use-case";
import {
  ITintaRepository,
  TintaQuery,
} from "@/domains/tintas/domain/repositories/tinta.repository";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";

describe("GetTintasByQueryUseCase", () => {
  it("should return tintas by query", async () => {
    const tintaEntity = MockTintaBuilder.buildEntity();
    const mockTintas = [tintaEntity];

    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.getByQuery.mockResolvedValue(mockTintas);

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = {
      cor: tintaEntity.cor,
      ambiente: tintaEntity.ambiente,
    };

    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: mockTintas });
  });
});
