import z from "zod";

export const RequestLoginDTOSchema = z.object({
  email: z.email().nonempty().nonoptional(),
  senha: z.string().nonempty().nonoptional(),
});

export type RequestLoginDTO = z.infer<typeof RequestLoginDTOSchema>;

export const ResponseLoginDTOSchema = z.object({
  accessToken: z.string(),
});

export type ResponseLoginDTO = z.infer<typeof ResponseLoginDTOSchema>;
