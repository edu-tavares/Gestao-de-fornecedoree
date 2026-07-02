import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "Informe o nome do colaborador"),
  cpf: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 11, "CPF deve ter 11 dígitos"),
  cargo: z.string().min(2, "Informe o cargo/função"),
  email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  telefone: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
