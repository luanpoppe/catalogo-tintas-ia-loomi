import { describe, it, expect } from "vitest";
import { TintaQueryMapper } from "../tinta-query.mapper";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";
import { TintaQuery } from "@/domains/tintas/domain/repositories/tinta.repository";
import { TintaEntity } from "@/domains/tintas/domain/entities/tintas.entity";

describe("TintaQueryMapper", () => {
  const allMockTintas = MockTintaBuilder.buildEntities();

  describe("filtraTintasPorFeatures", () => {
    it("deve filtrar tintas por features (case-insensitive)", () => {
      const tintas: TintaEntity[] = [
        {
          ...MockTintaBuilder.buildEntity(),
          features: ["Secagem Rápida", "Anti-mofo"],
        },
        {
          ...MockTintaBuilder.buildEntity(),
          id: 2,
          features: ["Resistente à Água"],
        },
      ];
      const queryFeatures = ["rápida"];
      const result = TintaQueryMapper.filtraTintasPorFeatures(
        tintas,
        queryFeatures
      );
      expect(result).toEqual([tintas[0]]);
    });

    it("deve retornar todas as tintas se queryFeatures for vazio", () => {
      const tintas: TintaEntity[] = [
        { ...MockTintaBuilder.buildEntity(), features: ["Secagem Rápida"] },
        {
          ...MockTintaBuilder.buildEntity(),
          id: 2,
          features: ["Resistente à Água"],
        },
      ];
      const queryFeatures: string[] = [];
      const result = TintaQueryMapper.filtraTintasPorFeatures(
        tintas,
        queryFeatures
      );
      expect(result).toEqual(tintas);
    });

    it("deve retornar um array vazio se nenhuma tinta corresponder às features", () => {
      const tintas: TintaEntity[] = [
        { ...MockTintaBuilder.buildEntity(), features: ["Secagem Rápida"] },
      ];
      const queryFeatures = ["Anti-mofo"];
      const result = TintaQueryMapper.filtraTintasPorFeatures(
        tintas,
        queryFeatures
      );
      expect(result).toEqual([]);
    });
  });

  describe("gerarWhereDaQuery", () => {
    it("deve gerar um objeto where com cor", () => {
      const query: TintaQuery = { cor: "Vermelho" };
      const result = TintaQueryMapper.gerarWhereDaQuery(query);
      expect(result).toEqual({
        cor: {
          contains: "Vermelho",
          mode: "insensitive",
        },
      });
    });

    it("deve gerar um objeto where com ambiente", () => {
      const query: TintaQuery = { ambiente: "INTERNO" };
      const result = TintaQueryMapper.gerarWhereDaQuery(query);
      expect(result).toEqual({ ambiente: "INTERNO" });
    });

    it("deve gerar um objeto where com acabamento", () => {
      const query: TintaQuery = { acabamento: "BRILHANTE" };
      const result = TintaQueryMapper.gerarWhereDaQuery(query);
      expect(result).toEqual({ acabamento: "BRILHANTE" });
    });

    it("deve gerar um objeto where com linhas", () => {
      const query: TintaQuery = { linhas: "PREMIUM" };
      const result = TintaQueryMapper.gerarWhereDaQuery(query);
      expect(result).toEqual({ linhas: "PREMIUM" });
    });

    it("deve gerar um objeto where com tiposDeSuperfeicie", () => {
      const query: TintaQuery = {
        tiposDeSuperfeicie: ["ALVENARIA", "MADEIRA"],
      };
      const result = TintaQueryMapper.gerarWhereDaQuery(query);
      expect(result).toEqual({
        tiposDeSuperfeicie: {
          hasEvery: ["ALVENARIA", "MADEIRA"],
        },
      });
    });

    it("deve gerar um objeto where com múltiplas propriedades", () => {
      const query: TintaQuery = {
        cor: "Azul",
        ambiente: "EXTERNO",
        acabamento: "FOSCO",
        linhas: "STANDARD",
        tiposDeSuperfeicie: ["FERRO"],
      };
      const result = TintaQueryMapper.gerarWhereDaQuery(query);
      expect(result).toEqual({
        cor: {
          contains: "Azul",
          mode: "insensitive",
        },
        ambiente: "EXTERNO",
        acabamento: "FOSCO",
        linhas: "STANDARD",
        tiposDeSuperfeicie: {
          hasEvery: ["FERRO"],
        },
      });
    });

    it("deve gerar um objeto where vazio se a query for vazia", () => {
      const query: TintaQuery = {};
      const result = TintaQueryMapper.gerarWhereDaQuery(query);
      expect(result).toEqual({});
    });

    it("não deve incluir tiposDeSuperfeicie se o array estiver vazio", () => {
      const query: TintaQuery = { tiposDeSuperfeicie: [] };
      const result = TintaQueryMapper.gerarWhereDaQuery(query);
      expect(result).toEqual({});
    });
  });
});
