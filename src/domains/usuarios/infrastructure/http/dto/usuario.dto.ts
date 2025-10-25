import z from "zod";
import { UsuarioSchema } from "@/domains/usuarios/domain/entities/usuario.entity";

export const RequestUsuarioDTOSchema = UsuarioSchema.extend({
  password: z.string().min(8).max(25).nonempty(),
}).omit({ id: true });

export type RequestUsuarioDTO = z.infer<typeof RequestUsuarioDTOSchema>;

export const RequestUpdateUsuarioDTOSchema = UsuarioSchema.omit({ id: true });

export type RequestUpdateUsuarioDTO = z.infer<
  typeof RequestUpdateUsuarioDTOSchema
>;

export type ResponseUsuarioDTO = z.infer<typeof UsuarioSchema>;
