import { FastifyReply, FastifyRequest } from "fastify";
import { VerificarPermissaoDoUsuarioMiddleware } from "../verificar-permissao-do-usuario.middleware";
import { PERMISSOES } from "../../../generated/prisma/enums";

describe("VerificarPermissaoDoUsuarioMiddleware", () => {
  let request: FastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    request = {
      user: {
        sub: 1,
        tipoDeUsuario: PERMISSOES.ADMIN as PERMISSOES | undefined,
      },
    } as unknown as FastifyRequest;

    reply = {
      status: vi.fn(() => reply),
      send: vi.fn(),
    } as unknown as FastifyReply;
  });

  it("deve permitir o acesso se o usuário tiver a permissão necessária", async () => {
    const handler = VerificarPermissaoDoUsuarioMiddleware.middleware(
      PERMISSOES.ADMIN
    );
    await handler(request, reply);

    expect(reply.status).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
  });

  it("deve retornar 403 se o usuário não tiver a permissão necessária", async () => {
    const handler = VerificarPermissaoDoUsuarioMiddleware.middleware(
      PERMISSOES.COMUM
    );
    await handler(request, reply);

    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith({
      error: "Acesso não permitido.",
    });
  });

  it("deve retornar 403 se o usuário não tiver tipoDeUsuario definido e uma permissão for necessária", async () => {
    const requestWithoutRole = {
      user: {
        sub: "user-id",
        tipoDeUsuario: undefined,
      },
    } as unknown as FastifyRequest;

    const handler = await VerificarPermissaoDoUsuarioMiddleware.middleware(
      PERMISSOES.ADMIN
    );
    await handler(requestWithoutRole, reply);

    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith({
      error: "Acesso não permitido.",
    });
  });
});
