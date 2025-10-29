import { TintaEntity } from "./../../domain/entities/tintas.entity";
import {
  ITintaRepository,
  TintaQuery,
} from "../../domain/repositories/tinta.repository";
import { prisma } from "../../../../lib/prisma";
import { RequestTintaDTO, RequestUpdateTintaDTO } from "../http/dto/tinta.dto";
import { TintasWhereInput } from "../../../../generated/prisma/models";
import { TintaQueryMapper } from "../mappers/tinta-query.mapper";

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

  async doesIdExist(id: number) {
    const count = await prisma.tintas.count({
      where: { id },
    });

    if (count === 1) return true;
    return false;
  }

  async getByQuery(query: TintaQuery): Promise<TintaEntity[]> {
    const where: TintasWhereInput = TintaQueryMapper.gerarWhereDaQuery(query);

    const tintas = await prisma.tintas.findMany({
      where,
    });

    return tintas;
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
}
