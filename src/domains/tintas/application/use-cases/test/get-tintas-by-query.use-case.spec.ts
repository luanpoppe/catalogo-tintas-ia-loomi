import { describe, it, expect } from "vitest";
import { GetTintasByQueryUseCase } from "../get-tintas-by-query.use-case";
import { TintaQuery } from "@/domains/tintas/domain/repositories/tinta.repository";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";

describe("GetTintasByQueryUseCase", () => {
  it("deve retornar tintas por query", async () => {
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
