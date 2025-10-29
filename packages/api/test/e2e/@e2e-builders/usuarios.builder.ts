import { app } from "@/app";
import {
  RequestLoginDTO,
  ResponseLoginDTO,
} from "@/domains/auth/infrastructure/http/dto/login.dto";
import {
  RequestUsuarioDTO,
  ResponseCreateUsuarioDTO,
  ResponseUsuarioDTO,
} from "@/domains/usuarios/infrastructure/http/dto/usuario.dto";
import { BCryptJS } from "@/lib/encrypt/bcryptjs";
import { prisma } from "@/lib/prisma";
import request from "supertest";
import { faker } from "@faker-js/faker";

export class UsuariosBuilder {
  static async criarUsuarioComum() {
    const email = faker.internet.email();
    const senha = "Senha123abc";

    const requestBody: RequestUsuarioDTO = {
      nome: "Usuario Comum",
      email: email,
      senha,
      tipoUsuario: "COMUM",
    };

    const resposta = await request(app.server)
      .post("/usuario")
      .send(requestBody);

    const cookies = resposta.get("Set-Cookie") ?? [];

    const { usuario, accessToken } = resposta.body as ResponseCreateUsuarioDTO;

    return {
      usuario,
      accessToken,
      senha,
      cookies,
    };
  }

  static async criarUsuarioAdmin() {
    const senha = "Senha123abc";
    const encryptService = new BCryptJS();
    const senhaHashed = await encryptService.hash(senha);

    const admin = await prisma.usuarios.create({
      data: {
        email: faker.internet.email(),
        nome: "Usuario Admin",
        tipoUsuario: "ADMIN",
        passwordHash: senhaHashed,
      },
    });

    return { admin, senha };
  }

  static async criarELogarUsuarioAdmin() {
    const { admin, senha } = await this.criarUsuarioAdmin();

    const requestBody: RequestLoginDTO = {
      email: admin.email,
      senha: senha,
    };

    const resposta = await request(app.server)
      .post("/auth/login")
      .send(requestBody);

    const cookies = resposta.get("Set-Cookie") ?? [];

    const { accessToken }: ResponseLoginDTO = resposta.body;

    return {
      usuarioCriado: admin,
      accessToken,
      cookies,
    };
  }
}
