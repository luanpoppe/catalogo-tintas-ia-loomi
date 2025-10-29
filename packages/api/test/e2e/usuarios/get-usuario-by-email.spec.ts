import request from "supertest";
import { app } from "@/app";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";

describe("Buscar usuário por email", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usuário administrador deve poder buscar um usuário por email", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const { usuario: usuarioCriado, senha } =
      await UsuariosBuilder.criarUsuarioComum();
    await request(app.server)
      .post("/usuario")
      .send({ ...usuarioCriado, senha });

    const usuarioEmail: string = usuarioCriado.email;

    const buscarResposta = await request(app.server)
      .get(`/usuario/email/${usuarioEmail}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(buscarResposta.statusCode).toEqual(200);
    expect(buscarResposta.body).toEqual(
      expect.objectContaining({
        id: usuarioCriado.id,
        email: usuarioCriado.email,
        nome: usuarioCriado.nome,
        tipoUsuario: usuarioCriado.tipoUsuario,
      })
    );
  });

  it("usuário comum não deve poder buscar um usuário por email", async () => {
    const { accessToken, cookies } = await UsuariosBuilder.criarUsuarioComum();

    const { usuario: usuarioCriado, senha } =
      await UsuariosBuilder.criarUsuarioComum();
    await request(app.server)
      .post("/usuario")
      .send({ ...usuarioCriado, senha });

    const usuarioEmail: string = usuarioCriado.email;

    const buscarResposta = await request(app.server)
      .get(`/usuario/email/${usuarioEmail}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(buscarResposta.statusCode).toEqual(403);
    expect(buscarResposta.body).toEqual({ error: expect.any(String) });
  });

  it("deve retornar 404 se o usuário não for encontrado", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const usuarioEmailInexistente: string = "naoexiste@example.com";

    const buscarResposta = await request(app.server)
      .get(`/usuario/email/${usuarioEmailInexistente}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(buscarResposta.statusCode).toEqual(404);
    expect(buscarResposta.body).toEqual({ error: expect.any(String) });
  });
});
