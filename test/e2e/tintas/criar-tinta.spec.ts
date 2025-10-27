import request from "supertest";
import { app } from "@/app";
import { RequestTintaDTO } from "@/domains/tintas/infrastructure/http/dto/tinta.dto";
import { TintasBuilder } from "../@e2e-builders/tintas.builder";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";

describe("Criar usuário", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usuário administrador deve poder criar uma tinta", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();
    const { tintaRequestBody } = TintasBuilder.gerarTintaRequestBody();

    const resposta = await request(app.server)
      .post("/tinta")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(tintaRequestBody);

    expect(resposta.statusCode).toEqual(201);
    expect(resposta.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ...tintaRequestBody,
      })
    );
  });

  it("usuário comum não deve poder criar uma tinta", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioComum();
    const { tintaRequestBody } = TintasBuilder.gerarTintaRequestBody();

    const resposta = await request(app.server)
      .post("/tinta")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(tintaRequestBody);

    expect(resposta.statusCode).toEqual(403);
    expect(resposta.body).toEqual({ error: expect.any(String) });
  });
});
