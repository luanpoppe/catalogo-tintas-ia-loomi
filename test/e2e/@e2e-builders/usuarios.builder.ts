import { app } from "@/app";
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
}
