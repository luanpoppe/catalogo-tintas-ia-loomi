import { LoginUseCase } from "@/domains/auth/application/use-cases/login.use-case";
import { UsuarioRepository } from "@/domains/usuarios/infrastructure/repositories/usuario.repository";
import { BCryptJS } from "@/lib/encrypt/bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { RequestLoginDTO } from "../dto/login.dto";
import { Usuarios } from "@/generated/prisma/client";

export class AuthController {
  constructor() {}

  static async login(
    req: FastifyRequest<{
      Body: RequestLoginDTO;
    }>,
    reply: FastifyReply
  ) {
    const usuarioRepository = new UsuarioRepository();
    const encryptService = new BCryptJS();
    const useCase = new LoginUseCase(usuarioRepository, encryptService);

    try {
      const { usuario } = await useCase.execute(req.body);

      const { accessToken, refreshToken } =
        await AuthController.gerarTokensLogin(usuario, reply);

      return reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({ accessToken });
    } catch (error: any) {
      return reply.status(401).send({ error: error.message });
    }
  }

  static async refreshToken(req: FastifyRequest, reply: FastifyReply) {
    await req.jwtVerify({ onlyCookie: true });

    const { tipoDeUsuario } = req.user;

    const accessToken = await reply.jwtSign(
      {
        tipoDeUsuario,
      },
      {
        sign: {
          sub: req.user.sub.toString(),
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      { tipoDeUsuario },
      {
        sign: {
          sub: req.user.sub.toString(),
          expiresIn: "7d",
        },
      }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ accessToken });
  }

  private static async gerarTokensLogin(
    usuario: Usuarios,
    reply: FastifyReply
  ) {
    const accessToken = await reply.jwtSign(
      { tipoDeUsuario: usuario.tipoUsuario },
      {
        sign: {
          sub: usuario.id.toString(),
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      { tipoDeUsuario: usuario.tipoUsuario },
      {
        sign: {
          sub: usuario.id.toString(),
          expiresIn: "7d",
        },
      }
    );

    return { accessToken, refreshToken };
  }
}
