import { IUsuarioRepository } from "../../domain/repositories/usuario.repository";
import { RequestUsuarioDTO } from "../http/dto/usuario.dto";
import { prisma } from "@/lib/prisma";

export class UsuarioRepository implements IUsuarioRepository {
  async findById(id: number) {
    const usuario = await prisma.usuarios.findUnique({
      where: { id },
    });
    return usuario;
  }

  async findByEmail(email: string) {
    const usuario = await prisma.usuarios.findUnique({
      where: { email },
    });
    return usuario;
  }

  async create(usuarioData: RequestUsuarioDTO) {
    const { senha, ...rest } = usuarioData;
    const novoUsuario = await prisma.usuarios.create({
      data: {
        ...rest,
        passwordHash: senha,
      },
    });
    return novoUsuario;
  }

  async update(id: number, usuarioData: RequestUsuarioDTO) {
    const { senha, ...rest } = usuarioData;
    const usuarioAtualizado = await prisma.usuarios.update({
      where: { id },
      data: {
        ...rest,
        passwordHash: senha,
      },
    });
    return usuarioAtualizado;
  }

  async delete(id: number) {
    await prisma.usuarios.delete({
      where: { id },
    });
  }

  async doesIdExist(id: number) {
    const count = await prisma.usuarios.count({
      where: { id },
    });

    if (count === 1) return true;
    return false;
  }
}
