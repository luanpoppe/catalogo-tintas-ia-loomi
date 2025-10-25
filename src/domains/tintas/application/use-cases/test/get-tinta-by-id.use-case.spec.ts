import { describe, it, expect } from "vitest";
import { GetTintaByIdUseCase } from "../get-tinta-by-id.use-case";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";

describe("GetTintaByIdUseCase", () => {
  it("should return a tinta by id", async () => {
    const mockTinta = MockTintaBuilder.buildEntity();

    const mockTintaRepository = MockTintaBuilder.buildMockRepository();

    mockTintaRepository.findById.mockResolvedValue(mockTinta);

    const getTintaByIdUseCase = new GetTintaByIdUseCase(mockTintaRepository);

    const tintaId = mockTinta.id!;
    const result = await getTintaByIdUseCase.execute(tintaId);

    expect(mockTintaRepository.findById).toHaveBeenCalledWith(tintaId);
    expect(result).toEqual({ tinta: mockTinta });
  });
});
