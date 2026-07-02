"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supplierSignupSchema } from "@/lib/validators/supplier";

export async function registerSupplier(
  _prevState: string | undefined,
  formData: FormData,
) {
  const parsed = supplierSignupSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  const { name, email, password, confirmPassword: _confirmPassword, cnpj, ...supplierData } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return "Já existe uma conta com este e-mail.";
  }

  const existingSupplier = await prisma.supplier.findUnique({
    where: { cnpj },
  });
  if (existingSupplier) {
    return "Já existe um fornecedor cadastrado com este CNPJ.";
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const supplier = await tx.supplier.create({
      data: {
        ...supplierData,
        cnpj,
        email,
        status: "PENDENTE",
      },
    });
    await tx.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "FORNECEDOR",
        supplierId: supplier.id,
      },
    });
  });

  await signIn("credentials", { email, password, redirectTo: "/" });
}
