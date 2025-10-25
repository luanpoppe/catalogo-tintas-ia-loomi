import { describe, it, expect, vi } from "vitest";
import { GetTintasByQueryUseCase } from "../get-tintas-by-query.use-case";
import {
  ITintaRepository,
  TintaQuery,
} from "@/domains/tintas/domain/repositories/tinta.repository";

describe("GetTintasByQueryUseCase", () => {
  it("should return tintas by query", async () => {
    const mockTintas = [
      {
        id: 1,
        nome: "Tinta Teste 1",
        cor: "Vermelho",
        ambiente: "INTERNO",
        acabamento: "BRILHANTE",
        features: ["Secagem Rápida"],
        linhas: "PREMIUM",
        tiposDeSuperfeicie: ["ALVENARIA"],
      },
    ];

    const mockTintaRepository: ITintaRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getByQuery: vi.fn().mockResolvedValue(mockTintas),
    };

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = {
      cor: "Vermelho",
      ambiente: "INTERNO",
    };

    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: mockTintas });
  });
});
