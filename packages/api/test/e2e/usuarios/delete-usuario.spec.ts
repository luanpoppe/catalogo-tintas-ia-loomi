import request from "supertest";
import { app } from "@/app";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";

describe("Deletar usuário", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usuário administrador deve poder deletar um usuário", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const { usuario: usuarioCriado } =
      await UsuariosBuilder.criarUsuarioComum();

    const usuarioId: number = usuarioCriado.id!;

    const deletarResposta = await request(app.server)
      .delete(`/usuario/${usuarioId}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(deletarResposta.statusCode).toEqual(204); // No Content
  });

  it("usuário comum não deve poder deletar um usuário", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioComum();

    const { usuario: usuarioCriado, senha } =
      await UsuariosBuilder.criarUsuarioComum();
    await request(app.server)
      .post("/usuario")
      .send({ ...usuarioCriado, senha });

    const usuarioId: number = usuarioCriado.id!;

    const deletarResposta = await request(app.server)
      .delete(`/usuario/${usuarioId}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deletarResposta.statusCode).toEqual(403);
    expect(deletarResposta.body).toEqual({ error: expect.any(String) });
  });

  it("deve retornar 404 se o usuário a ser deletado não for encontrado", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const usuarioIdInexistente: number = 9999;

    const deletarResposta = await request(app.server)
      .delete(`/usuario/${usuarioIdInexistente}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deletarResposta.statusCode).toEqual(404);
    expect(deletarResposta.body).toEqual({ error: expect.any(String) });
  });
}, 30000);
