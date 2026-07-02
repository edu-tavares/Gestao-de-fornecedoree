import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { SUPPLIER_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const STATUS_BADGE_STYLES = {
  PENDENTE: "bg-slate-100 text-slate-700",
  EM_ANALISE: "bg-amber-100 text-amber-800",
  APROVADO: "bg-green-100 text-green-800",
  REJEITADO: "bg-red-100 text-red-800",
};

const FILTERS = ["TODOS", "PENDENTE", "EM_ANALISE", "APROVADO", "REJEITADO"] as const;

export default async function AdminFornecedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter = FILTERS.includes(status as (typeof FILTERS)[number])
    ? (status as (typeof FILTERS)[number])
    : "TODOS";

  const suppliers = await prisma.supplier.findMany({
    where: activeFilter === "TODOS" ? {} : { status: activeFilter },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Fornecedores</h1>
        <SignOutButton />
      </div>

      <div className="mb-6 flex gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter}
            href={`/admin/fornecedores${filter === "TODOS" ? "" : `?status=${filter}`}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              activeFilter === filter
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {filter === "TODOS" ? "Todos" : SUPPLIER_STATUS_LABELS[filter]}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {suppliers.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Nenhum fornecedor encontrado.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {suppliers.map((supplier) => (
              <li key={supplier.id}>
                <Link
                  href={`/admin/fornecedores/${supplier.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {supplier.razaoSocial}
                    </p>
                    <p className="text-xs text-slate-500">{supplier.cnpj}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_STYLES[supplier.status]}`}
                  >
                    {SUPPLIER_STATUS_LABELS[supplier.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
