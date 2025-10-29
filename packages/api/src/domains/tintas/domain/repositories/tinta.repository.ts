import {
  RequestTintaDTO,
  RequestUpdateTintaDTO,
} from "../../infrastructure/http/dto/tinta.dto";
import {
  ACABAMENTOS_SCHEMA,
  AMBIENTES_SCHEMA,
  LINHAS_SCHEMA,
  TIPOS_DE_SUPERFICIE_SCHEMA,
} from "../entities/tintas.entity";
import { TintaEntity } from "../entities/tintas.entity";
import z from "zod";

export type TintaQuery = {
  cor?: string;
  ambiente?: z.infer<typeof AMBIENTES_SCHEMA>;
  acabamento?: z.infer<typeof ACABAMENTOS_SCHEMA>;
  features?: string;
  linhas?: z.infer<typeof LINHAS_SCHEMA>;
  tiposDeSuperfeicie?: z.infer<typeof TIPOS_DE_SUPERFICIE_SCHEMA>[];
};

export interface ITintaRepository {
  findAll(): Promise<TintaEntity[]>;

  findById(id: number): Promise<TintaEntity | null>;

  getByQuery(query: TintaQuery): Promise<TintaEntity[]>;

  create(tinta: RequestTintaDTO): Promise<TintaEntity>;

  update(id: number, tinta: RequestUpdateTintaDTO): Promise<TintaEntity>;

  delete(id: number): Promise<void>;

  doesIdExist(id: number): Promise<boolean>;
}
