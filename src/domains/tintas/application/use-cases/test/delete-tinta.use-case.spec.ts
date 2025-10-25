import { describe, it, expect, vi } from "vitest";
import { DeleteTintaUseCase } from "../delete-tinta.use-case";
import { ITintaRepository } from "@/domains/tintas/domain/repositories/tinta.repository";

describe("DeleteTintaUseCase", () => {
  it("should delete a tinta by id", async () => {
    const mockTintaRepository: ITintaRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
      getByQuery: vi.fn(),
    };

    const deleteTintaUseCase = new DeleteTintaUseCase(mockTintaRepository);

    const tintaId = 1;
    await deleteTintaUseCase.execute(tintaId);

    expect(mockTintaRepository.delete).toHaveBeenCalledWith(tintaId);
  });
});
