import z from "zod";

export const TIPOS_DE_USUARIO_SCHEMA = z.enum(["ADMIN", "COMUM"]);

export const UsuarioSchema = z.object({
  id: z.number().int().positive().optional(),
  nome: z.string().min(1, "O nome é obrigatório."),
  email: z.email("Formato de e-mail inválido."),
  tipoUsuario: TIPOS_DE_USUARIO_SCHEMA,
});

export type UsuarioEntity = z.infer<typeof UsuarioSchema>;
