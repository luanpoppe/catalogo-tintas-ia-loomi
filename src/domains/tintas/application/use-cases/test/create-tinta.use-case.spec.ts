import { describe, it, expect, vi } from "vitest";
import { CreateTintaUseCase } from "../create-tinta.use-case";
import { ITintaRepository } from "@/domains/tintas/domain/repositories/tinta.repository";
import { RequestTintaDTO } from "@/domains/tintas/infrastructure/http/dto/tinta.dto";

describe("CreateTintaUseCase", () => {
  it("should create a new tinta", async () => {
    const mockTintaRepository: ITintaRepository = {
      create: vi.fn().mockResolvedValue({
        id: 1,
        nome: "Tinta Teste",
        cor: "Vermelho",
        ambiente: "INTERNO",
        acabamento: "BRILHANTE",
        features: ["Secagem Rápida"],
        linhas: "PREMIUM",
        tiposDeSuperfeicie: ["ALVENARIA"],
      }),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getByQuery: vi.fn(),
    };

    const createTintaUseCase = new CreateTintaUseCase(mockTintaRepository);

    const tintaData: RequestTintaDTO = {
      nome: "Tinta Teste",
      cor: "Vermelho",
      ambiente: "INTERNO",
      acabamento: "BRILHANTE",
      features: ["Secagem Rápida"],
      linhas: "PREMIUM",
      tiposDeSuperfeicie: ["ALVENARIA"],
    };

    const result = await createTintaUseCase.execute(tintaData);

    expect(mockTintaRepository.create).toHaveBeenCalledWith(tintaData);
    expect(result).toEqual({
      tinta: {
        id: 1,
        nome: "Tinta Teste",
        cor: "Vermelho",
        ambiente: "INTERNO",
        acabamento: "BRILHANTE",
        features: ["Secagem Rápida"],
        linhas: "PREMIUM",
        tiposDeSuperfeicie: ["ALVENARIA"],
      },
    });
  });
});
