import { TintaEntity } from "./../../domain/entities/tintas.entity";
import {
  ItintaRepository,
  TintaQuery,
} from "../../domain/repositories/tinta.repository";
import { prisma } from "../../../../lib/prisma";
import { RequestTintaDTO, RequestUpdateTinta } from "../http/dto/tinta.dto";

export class TintaRepository implements ItintaRepository {
  async getById(id: number) {
    const tinta = await prisma.tintas.findUnique({
      where: { id },
    });

    if (!tinta) throw new Error("Tinta não encontrada.");

    return tinta;
  }

  async getByNome(nome: string) {
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

  async getByQuery(query: TintaQuery) {
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

  async create(tinta: RequestTintaDTO) {
    const novaTinta = await prisma.tintas.create({
      data: {
        nome: tinta.nome,
        cor: tinta.cor,
        ambiente: tinta.ambiente,
        acabamento: tinta.acabamento,
        features: tinta.features,
        linhas: tinta.linhas,
        tiposDeSuperfeicie: tinta.tiposDeSuperfeicie,
      },
    });
    return novaTinta;
  }

  async update(id: number, tinta: RequestUpdateTinta) {
    const tintaAtualizada = await prisma.tintas.update({
      where: { id },
      data: tinta,
    });
    return tintaAtualizada;
  }

  async delete(id: number) {
    await prisma.tintas.delete({
      where: { id },
    });
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
