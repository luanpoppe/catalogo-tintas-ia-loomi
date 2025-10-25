import fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import {
  jsonSchemaTransform,
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { Langchain } from "./lib/langchain/langchain";
import { TintasRouter } from "./domains/tintas/infrastructure/http/controllers/tintas.router";
import { UsuariosRouter } from "./domains/usuarios/infrastructure/http/controllers/usuarios.router";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: [/^http:\/\/localhost(:\d+)?$/],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

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

app.register(TintasRouter.route, { prefix: "/tinta" });

app.register(UsuariosRouter.route, { prefix: "/usuario" });

app.post("/", async (req, reply) => {
  const model = Langchain.models.gemini();

  try {
    const agent = await Langchain.createAgent({ model });
    const res = await agent.invoke(
      {
        messages: [{ role: "user", content: (req.body as any).content }],
      },
      { configurable: { thread_id: "1" } }
    );

    return reply.status(200).send({ msg: "Hello", res });
  } catch (error: any) {
    console.error(error);
    throw new Error();
  }
});

export { app };
