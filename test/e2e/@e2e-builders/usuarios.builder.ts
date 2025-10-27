import { app } from "@/app";
import {
  RequestLoginDTO,
  ResponseLoginDTO,
} from "@/domains/auth/infrastructure/http/dto/login.dto";
import {
  RequestUsuarioDTO,
  ResponseUsuarioDTO,
} from "@/domains/usuarios/infrastructure/http/dto/usuario.dto";
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
    const email = "abc@gmail.com";
    const senha = "Senha123abc";

    const requestBody: RequestUsuarioDTO = {
      nome: "abc",
      email: email,
      senha,
      tipoUsuario: "ADMIN",
    };

    const { body } = await request(app.server)
      .post("/usuario")
      .send(requestBody);

    return {
      usuario: body as ResponseUsuarioDTO,
      senha,
    };
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
}
