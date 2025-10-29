import request from "supertest";
import { app } from "@/app";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import { RequestChatDTO } from "@/domains/chat/infrastructure/http/dto/chat.dto";

describe("Chat", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it("deve ser possível enviar uma mensagem ao agente de IA e receber uma resposta", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();
    const chatRequestBody: RequestChatDTO = {
      userMessage: "Quero uma tinta que seja sem cheiro",
      shouldEraseMemory: true,
    };

    const resposta = await request(app.server)
      .post("/chat")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(chatRequestBody);

    console.log({ "resposta.body": resposta.body });

    expect(resposta.statusCode).toEqual(200);
    expect(resposta.body).toEqual({ aiMessage: expect.any(String) });
  });
}, 20000);
