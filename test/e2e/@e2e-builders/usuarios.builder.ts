import { app } from "@/app";
import {
  RequestLoginDTO,
  ResponseLoginDTO,
} from "@/domains/auth/infrastructure/http/dto/login.dto";
import {
  RequestUsuarioDTO,
  ResponseUsuarioDTO,
} from "@/domains/usuarios/infrastructure/http/dto/usuario.dto";
import { BCryptJS } from "@/lib/encrypt/bcryptjs";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import request from "supertest";

export class UsuariosBuilder {
  static async criarUsuarioComum() {
    const email = "abc@gmail.com";
    const senha = "Senha123abc";

    const requestBody: RequestUsuarioDTO = {
      nome: "abc",
      email: email,
      senha,
      tipoUsuario: "COMUM",
    };

    const { body } = await request(app.server)
      .post("/usuario")
      .send(requestBody);

    return {
      usuario: body as ResponseUsuarioDTO,
      senha,
    };
  }

  static async criarUsuarioAdmin() {
    const senha = "Senha123abc";
    const encryptService = new BCryptJS();
    const senhaHashed = await encryptService.hash(senha);

    const admin = await prisma.usuarios.create({
      data: {
        email: "abcAdmin@gmail.com",
        nome: "abc",
        tipoUsuario: "ADMIN",
        passwordHash: senhaHashed,
      },
    });

    return { admin, senha };
  }

  static async criarELogarUsuarioComum() {
    const usuarioCriado = await this.criarUsuarioComum();

    const requestBody: RequestLoginDTO = {
      email: usuarioCriado.usuario.email,
      senha: usuarioCriado.senha,
    };

    const resposta = await request(app.server)
      .post("/auth/login")
      .send(requestBody);

    const cookies = resposta.get("Set-Cookie") ?? [];

    const { accessToken }: ResponseLoginDTO = resposta.body;

    return {
      ...usuarioCriado,
      accessToken,
      cookies,
    };
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
