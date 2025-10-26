import { app } from "@/app";
import {
  RequestUsuarioDTO,
  ResponseUsuarioDTO,
} from "@/domains/usuarios/infrastructure/http/dto/usuario.dto";
import request from "supertest";

export class UsuariosBuilder {
  async criarUsuarioComum() {
    const email = "abc@gmail.com";

    const requestBody: RequestUsuarioDTO = {
      nome: "abc",
      email: email,
      senha: "Senha123abc",
      tipoUsuario: "COMUM",
    };

    const { body } = await request(app.server)
      .post("/usuario")
      .send(requestBody);

    return {
      usuario: body as ResponseUsuarioDTO,
    };
  }
  async criarUsuarioAdmin() {
    const email = "abc@gmail.com";

    const requestBody: RequestUsuarioDTO = {
      nome: "abc",
      email: email,
      senha: "Senha123abc",
      tipoUsuario: "ADMIN",
    };

    const { body } = await request(app.server)
      .post("/usuario")
      .send(requestBody);

    return {
      usuario: body as ResponseUsuarioDTO,
    };
  }
}
