import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { SUPPLIER_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

// Contagens precisam refletir o estado atual do banco a cada acesso.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const counts = await prisma.supplier.groupBy({
    by: ["status"],
    _count: true,
  });
  const countByStatus = Object.fromEntries(
    counts.map((c) => [c.status, c._count]),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Painel do administrador
        </h1>
        <SignOutButton />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(SUPPLIER_STATUS_LABELS).map(([status, label]) => (
          <Link
            key={status}
            href={`/admin/fornecedores?status=${status}`}
            className="rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50"
          >
            <p className="text-2xl font-semibold text-slate-900">
              {countByStatus[status] ?? 0}
            </p>
            <p className="text-xs text-slate-500">{label}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/fornecedores"
        className="text-sm font-medium text-slate-900 underline"
      >
        Ver todos os fornecedores
      </Link>
    </main>
  );
}
