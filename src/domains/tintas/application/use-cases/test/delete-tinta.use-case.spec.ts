import { describe, it, expect } from "vitest";
import { DeleteTintaUseCase } from "../delete-tinta.use-case";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";

describe("DeleteTintaUseCase", () => {
  it("deve deletar um tinta pelo id", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.delete.mockResolvedValue(undefined);

    const deleteTintaUseCase = new DeleteTintaUseCase(mockTintaRepository);

    const tintaId = MockTintaBuilder.buildEntity().id!;
    await deleteTintaUseCase.execute(tintaId);

    expect(mockTintaRepository.delete).toHaveBeenCalledWith(tintaId);
  });
});
