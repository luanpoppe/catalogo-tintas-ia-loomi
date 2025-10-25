import { RequestUsuarioDTO } from "../../infrastructure/http/dto/usuario.dto";
import { UsuarioEntity } from "../entities/usuario.entity";

export interface IUsuarioRepository {
  findById(id: number): Promise<UsuarioEntity | null>;

  findByEmail(email: string): Promise<UsuarioEntity | null>;

  create(usuario: RequestUsuarioDTO): Promise<UsuarioEntity>;

  update(id: number, usuario: RequestUsuarioDTO): Promise<UsuarioEntity>;

  delete(id: number): Promise<void>;
}
