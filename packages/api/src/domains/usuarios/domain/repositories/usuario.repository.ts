import { Usuarios } from "@/generated/prisma/client";
import {
  RequestUpdateUsuarioDTO,
  RequestUsuarioDTO,
} from "../../infrastructure/http/dto/usuario.dto";
import { UsuarioEntity } from "../entities/usuario.entity";

export interface IUsuarioRepository {
  findById(id: number): Promise<UsuarioEntity | null>;

  findByEmail(email: string): Promise<Usuarios | null>;

  create(usuario: RequestUsuarioDTO): Promise<UsuarioEntity>;

  update(id: number, usuario: RequestUpdateUsuarioDTO): Promise<UsuarioEntity>;

  delete(id: number): Promise<void>;

  doesIdExist(id: number): Promise<boolean>;
}
