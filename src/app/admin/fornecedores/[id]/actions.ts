"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Não autorizado.");
  }
  return session;
}

export async function approveSupplier(supplierId: string) {
  const session = await requireAdmin();

  await prisma.supplier.update({
    where: { id: supplierId },
    data: {
      status: "APROVADO",
      rejectionReason: null,
      reviewedAt: new Date(),
      reviewedById: session.user.id,
    },
  });

  revalidatePath(`/admin/fornecedores/${supplierId}`);
  revalidatePath("/admin/fornecedores");
  redirect(`/admin/fornecedores/${supplierId}`);
}

export async function rejectSupplier(
  supplierId: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  const session = await requireAdmin();

  const reason = formData.get("reason");
  if (typeof reason !== "string" || reason.trim().length === 0) {
    return "Informe o motivo da rejeição.";
  }

  await prisma.supplier.update({
    where: { id: supplierId },
    data: {
      status: "REJEITADO",
      rejectionReason: reason.trim(),
      reviewedAt: new Date(),
      reviewedById: session.user.id,
    },
  });

  revalidatePath(`/admin/fornecedores/${supplierId}`);
  revalidatePath("/admin/fornecedores");
  redirect(`/admin/fornecedores/${supplierId}`);
}
