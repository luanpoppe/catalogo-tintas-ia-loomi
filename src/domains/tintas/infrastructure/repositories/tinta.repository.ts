import { TintaEntity } from "./../../domain/entities/tintas.entity";
import {
  ITintaRepository,
  TintaQuery,
} from "../../domain/repositories/tinta.repository";
import { prisma } from "../../../../lib/prisma";
import { RequestTintaDTO, RequestUpdateTintaDTO } from "../http/dto/tinta.dto";
import { TintasWhereInput } from "../../../../generated/prisma/models";

export class TintaRepository implements ITintaRepository {
  async findAll(): Promise<TintaEntity[]> {
    const tintas = await prisma.tintas.findMany();
    return tintas;
  }

  async findById(id: number): Promise<TintaEntity | null> {
    const tinta = await prisma.tintas.findUnique({
      where: { id },
    });
    return tinta;
  }

  async getByQuery(query: TintaQuery): Promise<TintaEntity[]> {
    const where: TintasWhereInput = this.gerarWhereDaQuery(query);

    if (!query.features) query.features = [];

    const tintas = await prisma.tintas.findMany({
      where,
    });

    return this.filtraTintasPorFeatures(tintas, query.features);
  }

  async create(tinta: RequestTintaDTO): Promise<TintaEntity> {
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

  async update(id: number, tinta: RequestUpdateTintaDTO): Promise<TintaEntity> {
    const tintaAtualizada = await prisma.tintas.update({
      where: { id },
      data: tinta,
    });
    return tintaAtualizada;
  }

  async delete(id: number): Promise<void> {
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

  private gerarWhereDaQuery(query: TintaQuery) {
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
