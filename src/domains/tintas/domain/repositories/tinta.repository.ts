import {
  ACABAMENTOS_SCHEMA,
  AMBIENTES_SCHEMA,
  LINHAS_SCHEMA,
  TIPOS_DE_SUPERFICIE_SCHEMA,
} from "../entities/tintas.entity";
import { TintaEntity } from "../entities/tintas.entity";
import z from "zod";

export type TintaQuery = {
  cor: string;
  ambiente: z.infer<typeof AMBIENTES_SCHEMA>;
  acabamento: z.infer<typeof ACABAMENTOS_SCHEMA>;
  features: string[];
  linhas: z.infer<typeof LINHAS_SCHEMA>;
  tiposDeSuperfeicie: z.infer<typeof TIPOS_DE_SUPERFICIE_SCHEMA>[];
};

export interface ItintaRepository {
  getById(id: number): Promise<TintaEntity>;

  getByNome(nome: string): Promise<TintaEntity[]>;

  getByQuery(query: TintaQuery): Promise<TintaEntity[]>;
}
