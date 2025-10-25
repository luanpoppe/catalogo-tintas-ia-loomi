import { TintaEntity } from "@/domains/tintas/domain/entities/tintas.entity";
import { ITintaRepository } from "@/domains/tintas/domain/repositories/tinta.repository";
import { RequestTintaDTO } from "@/domains/tintas/infrastructure/http/dto/tinta.dto";
import { Mocked } from "vitest";

export class MockTintaBuilder {
  static buildEntity(): TintaEntity {
    return {
      id: 1,
      nome: "Tinta Teste",
      cor: "Vermelho",
      ambiente: "INTERNO",
      acabamento: "BRILHANTE",
      features: ["Secagem Rápida"],
      linhas: "PREMIUM",
      tiposDeSuperfeicie: ["ALVENARIA"],
    };
  }

  static buildEntities(): TintaEntity[] {
    return [
      this.buildEntity(),
      {
        id: 2,
        nome: "Tinta Teste 2",
        cor: "Azul",
        ambiente: "EXTERNO",
        acabamento: "FOSCO",
        features: ["Resistente à Água"],
        linhas: "STANDARD",
        tiposDeSuperfeicie: ["MADEIRA"],
      },
    ];
  }

  static buildRequestDTO(): RequestTintaDTO {
    return {
      nome: "Tinta Teste",
      cor: "Vermelho",
      ambiente: "INTERNO",
      acabamento: "BRILHANTE",
      features: ["Secagem Rápida"],
      linhas: "PREMIUM",
      tiposDeSuperfeicie: ["ALVENARIA"],
    };
  }

  static buildMockRepository(): Mocked<ITintaRepository> {
    return {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getByQuery: vi.fn(),
    };
  }
}
