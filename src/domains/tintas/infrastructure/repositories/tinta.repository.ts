import { TintaEntity } from "./../../domain/entities/tintas.entity";
import {
  ItintaRepository,
  TintaQuery,
} from "../../domain/repositories/tinta.repository";
import { prisma } from "../../../../lib/prisma";

export class TintaRepository implements ItintaRepository {
  async getById(id: number): Promise<TintaEntity> {
    const tinta = await prisma.tintas.findUnique({
      where: { id },
    });

    if (!tinta) throw new Error("Tinta não encontrada.");

    return tinta;
  }

  async getByNome(nome: string): Promise<TintaEntity[]> {
    const tintas = await prisma.tintas.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive",
        },
      },
    });

    return tintas;
  }

  async getByQuery(query: TintaQuery): Promise<TintaEntity[]> {
    const tintas = await prisma.tintas.findMany({
      where: {
        cor: {
          contains: query.cor,
          mode: "insensitive",
        },
        ambiente: query.ambiente,
        acabamento: query.acabamento,
        linhas: query.linhas,
        tiposDeSuperfeicie: {
          hasEvery: query.tiposDeSuperfeicie,
        },
      },
    });

    return this.filtraTintasPorFeatures(tintas, query.features);
  }

  private filtraTintasPorFeatures(
    tintas: TintaEntity[],
    queryFeatures: string[]
  ) {
    return tintas.filter((tinta) =>
      queryFeatures.some((queryFeature) =>
        tinta.features.some((tintaFeature) =>
          tintaFeature.toLowerCase().includes(queryFeature.toLowerCase())
        )
      )
    );
  }
}
