import { FastifyReply, FastifyRequest } from "fastify";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { VerificarUsuarioLogadoMiddleware } from "../verificar-usuario-logado.middleware";

describe("VerifyJwtMiddleware", () => {
  let request: FastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    request = {
      jwtVerify: vi.fn(),
    } as unknown as FastifyRequest;

    reply = {
      status: vi.fn(() => reply),
      send: vi.fn(),
    } as unknown as FastifyReply;
  });

  it("deve chamar jwtVerify e não retornar nada se for bem-sucedido", async () => {
    await VerificarUsuarioLogadoMiddleware.middleware(request, reply);

    expect(request.jwtVerify).toHaveBeenCalled();
    expect(reply.status).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
  });

  it("deve retornar status 401 e mensagem de acesso não autorizado se jwtVerify falhar", async () => {
    (request.jwtVerify as Mock).mockRejectedValue(new Error("Token inválido"));

    await VerificarUsuarioLogadoMiddleware.middleware(request, reply);

    expect(request.jwtVerify).toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Acesso não autorizado.",
    });
  });
});
