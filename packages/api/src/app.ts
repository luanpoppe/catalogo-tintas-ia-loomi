import fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { fastifyCookie } from "@fastify/cookie";
import {
  jsonSchemaTransform,
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { TintasRouter } from "./domains/tintas/infrastructure/http/controllers/tintas.router";
import { UsuariosRouter } from "./domains/usuarios/infrastructure/http/controllers/usuarios.router";
import { env } from "./env";
import { AuthRouter } from "./domains/auth/infrastructure/http/controllers/auth.router";
import { ExceptionHandler } from "./core/exceptions/exception-handler";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: [/^http:\/\/localhost(:\d+)?$/],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(fastifyCookie);

app.setErrorHandler((error, app, reply) =>
  ExceptionHandler.execute(error, reply)
);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Catálogo Inteligente de Tintas - Desafio Loomi",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/swagger",
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(TintasRouter.route, { prefix: "/tinta" });

app.register(UsuariosRouter.route, { prefix: "/usuario" });

app.register(AuthRouter.route, { prefix: "/auth" });

export { app };
