"use server";

import { prisma } from "@/lib/prisma";

export interface SupplierSearchResult {
  id: string;
  razaoSocial: string;
  cnpj: string;
  status: "PENDENTE" | "EM_ANALISE" | "APROVADO" | "REJEITADO";
}

export async function searchSuppliers(
  query: string,
): Promise<SupplierSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const suppliers = await prisma.supplier.findMany({
    where: {
      OR: [
        { razaoSocial: { contains: trimmed } },
        { cnpj: { contains: trimmed.replace(/\D/g, "") } },
      ],
    },
    select: { id: true, razaoSocial: true, cnpj: true, status: true },
    orderBy: { razaoSocial: "asc" },
    take: 20,
  });

  return suppliers;
}
