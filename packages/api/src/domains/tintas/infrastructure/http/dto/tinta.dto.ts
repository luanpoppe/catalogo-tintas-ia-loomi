import z from "zod";
import { TintaSchema } from "../../../domain/entities/tintas.entity";
import { TintasUpdateInput } from "../../../../../generated/prisma/models";

export const RequestTintaDTOSchema = TintaSchema;

export type RequestTintaDTO = z.infer<typeof RequestTintaDTOSchema>;

export type RequestUpdateTintaDTO = TintasUpdateInput;

export const ResponseTintaDTOSchema = TintaSchema.extend({
  id: z.coerce.number().int().positive(),
});

export type ResponseTintaDTO = z.infer<typeof ResponseTintaDTOSchema>;
