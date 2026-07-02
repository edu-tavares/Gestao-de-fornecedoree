import { z } from "zod";

export const supplierSignupSchema = z
  .object({
    razaoSocial: z.string().min(2, "Informe a razão social"),
    nomeFantasia: z.string().optional(),
    cnpj: z
      .string()
      .transform((value) => value.replace(/\D/g, ""))
      .refine((value) => value.length === 14, "CNPJ deve ter 14 dígitos"),
    telefone: z.string().min(8, "Informe um telefone válido"),
    endereco: z.string().min(3, "Informe o endereço"),
    cidade: z.string().min(2, "Informe a cidade"),
    estado: z.string().length(2, "UF inválida"),
    cep: z.string().min(8, "Informe um CEP válido"),
    name: z.string().min(2, "Informe o nome do responsável"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SupplierSignupInput = z.infer<typeof supplierSignupSchema>;
