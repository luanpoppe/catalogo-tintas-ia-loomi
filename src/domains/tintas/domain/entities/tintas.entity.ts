import z from "zod";

export const AMBIENTES_SCHEMA = z.enum([
  "INTERNO",
  "EXTERNO",
  "INTERNO_EXTERNO",
]);

export const ACABAMENTOS_SCHEMA = z.enum(["ACETINADO", "FOSCO", "BRILHANTE"]);

export const LINHAS_SCHEMA = z.enum(["PREMIUM", "STANDARD"]);

export const TIPOS_DE_SUPERFICIE_ZOD = z.enum([
  "ALVENARIA",
  "MADEIRA",
  "FERRO",
]);

export const TintaSchema = z.object({
  id: z.number().int().positive().optional(),
  nome: z.string().min(1, "O nome da tinta é obrigatório."),
  cor: z.string().min(1, "A cor é obrigatória."),
  ambiente: AMBIENTES_SCHEMA,
  acabamento: ACABAMENTOS_SCHEMA,
  features: z.array(z.string()),
  linhas: LINHAS_SCHEMA,
  tiposDeSuperfeicie: z.array(TIPOS_DE_SUPERFICIE_ZOD),
});

export type TintaEntity = z.infer<typeof TintaSchema>;
