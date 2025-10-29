import request from "supertest";
import { app } from "@/app";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import { faker } from "@faker-js/faker";

describe("Atualizar usuário", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usuário administrador deve poder atualizar um usuário", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const { usuario: usuarioCriado } =
      await UsuariosBuilder.criarUsuarioComum();
    const usuarioId: number = usuarioCriado.id!;
    const updatedEmail = faker.internet.email();
    const updatedNome = "Updated Name";

    const atualizarResposta = await request(app.server)
      .put(`/usuario/${usuarioId}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ email: updatedEmail, nome: updatedNome });

    expect(atualizarResposta.statusCode).toEqual(200);
    expect(atualizarResposta.body).toEqual(
      expect.objectContaining({
        id: usuarioCriado.id,
        email: updatedEmail,
        nome: updatedNome,
        tipoUsuario: usuarioCriado.tipoUsuario,
      })
    );
  });

  it("usuário comum não deve poder atualizar um usuário", async () => {
    const { accessToken, cookies } = await UsuariosBuilder.criarUsuarioComum();

    const { usuario: usuarioCriado, senha } =
      await UsuariosBuilder.criarUsuarioComum();
    await request(app.server)
      .post("/usuario")
      .send({ ...usuarioCriado, senha });

    const usuarioId: number = usuarioCriado.id!;
    const updatedEmail = faker.internet.email();
    const updatedNome = "Updated Name";

    const atualizarResposta = await request(app.server)
      .put(`/usuario/${usuarioId}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ email: updatedEmail, nome: updatedNome });

    expect(atualizarResposta.statusCode).toEqual(403);
    expect(atualizarResposta.body).toEqual({ error: expect.any(String) });
  });

  it("deve retornar 404 se o usuário a ser atualizado não for encontrado", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const usuarioIdInexistente: number = 9999;

    const updatedEmail = "updated@example.com";
    const updatedNome = "Updated Name";

    const atualizarResposta = await request(app.server)
      .put(`/usuario/${usuarioIdInexistente}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ email: updatedEmail, nome: updatedNome });

    expect(atualizarResposta.statusCode).toEqual(404);
    expect(atualizarResposta.body).toEqual({ error: expect.any(String) });
  });
}, 30000);
