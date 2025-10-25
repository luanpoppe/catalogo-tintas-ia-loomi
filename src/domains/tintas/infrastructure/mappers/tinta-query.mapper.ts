import { TintasWhereInput } from "@/generated/prisma/models";
import { TintaEntity } from "../../domain/entities/tintas.entity";
import { TintaQuery } from "../../domain/repositories/tinta.repository";

export class TintaQueryMapper {
  static filtraTintasPorFeatures(
    tintas: TintaEntity[],
    queryFeatures: string[]
  ) {
    if (!queryFeatures || queryFeatures.length === 0) {
      return tintas;
    }
    return tintas.filter((tinta) =>
      queryFeatures.some((queryFeature) =>
        tinta.features.some((tintaFeature) =>
          tintaFeature.toLowerCase().includes(queryFeature.toLowerCase())
        )
      )
    );
  }

  static gerarWhereDaQuery(query: TintaQuery) {
    const where: TintasWhereInput = {};

    if (query.cor)
      where.cor = {
        contains: query.cor,
        mode: "insensitive",
      };

    if (query.ambiente) where.ambiente = query.ambiente;
    if (query.acabamento) where.acabamento = query.acabamento;
    if (query.linhas) where.linhas = query.linhas;

    if (query.tiposDeSuperfeicie && query.tiposDeSuperfeicie.length > 0)
      where.tiposDeSuperfeicie = {
        hasEvery: query.tiposDeSuperfeicie,
      };

    return where;
  }
}
