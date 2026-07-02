"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validators/employee";

async function requireApprovedSupplier() {
  const session = await auth();
  if (session?.user.role !== "FORNECEDOR" || !session.user.supplierId) {
    throw new Error("Não autorizado.");
  }
  const supplier = await prisma.supplier.findUniqueOrThrow({
    where: { id: session.user.supplierId },
  });
  if (supplier.status !== "APROVADO") {
    throw new Error("Fornecedor ainda não homologado.");
  }
  return supplier;
}

export async function createEmployee(
  _prevState: string | undefined,
  formData: FormData,
) {
  const supplier = await requireApprovedSupplier();

  const parsed = employeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  const existing = await prisma.employee.findUnique({
    where: { supplierId_cpf: { supplierId: supplier.id, cpf: parsed.data.cpf } },
  });
  if (existing) {
    return "Já existe um colaborador cadastrado com este CPF.";
  }

  await prisma.employee.create({
    data: { ...parsed.data, supplierId: supplier.id },
  });

  revalidatePath("/colaboradores");
}

export async function toggleEmployeeActive(employeeId: string) {
  const supplier = await requireApprovedSupplier();

  const employee = await prisma.employee.findUniqueOrThrow({
    where: { id: employeeId },
  });
  if (employee.supplierId !== supplier.id) {
    throw new Error("Não autorizado.");
  }

  await prisma.employee.update({
    where: { id: employeeId },
    data: { active: !employee.active },
  });

  revalidatePath("/colaboradores");
}
