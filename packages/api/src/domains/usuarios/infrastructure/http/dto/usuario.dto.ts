import z from "zod";
import { UsuarioSchema } from "@/domains/usuarios/domain/entities/usuario.entity";

const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/;

export const RequestUsuarioDTOSchema = UsuarioSchema.extend({
  senha: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres.")
    .max(25, "A senha deve ter no máximo 25 caracteres.")
    .nonempty("A senha não pode estar vazia")
    .regex(
      regexSenha,
      "A senha deve conter pelo menos um número, uma letra maiúscula e uma minúscula."
    ),
}).omit({ id: true });

export type RequestUsuarioDTO = z.infer<typeof RequestUsuarioDTOSchema>;

export const RequestUpdateUsuarioDTOSchema = UsuarioSchema.omit({
  id: true,
}).partial();

export type RequestUpdateUsuarioDTO = z.infer<
  typeof RequestUpdateUsuarioDTOSchema
>;

export const ResponseUsuarioDTOSchema = UsuarioSchema;

export type ResponseUsuarioDTO = z.infer<typeof ResponseUsuarioDTOSchema>;
