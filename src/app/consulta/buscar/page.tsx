import { SignOutButton } from "@/components/sign-out-button";
import { SUPPLIER_STATUS_LABELS } from "@/lib/constants";
import { searchSuppliers } from "./actions";

const STATUS_BADGE_STYLES = {
  PENDENTE: "bg-slate-100 text-slate-700",
  EM_ANALISE: "bg-amber-100 text-amber-800",
  APROVADO: "bg-green-100 text-green-800",
  REJEITADO: "bg-red-100 text-red-800",
};

export default async function ConsultaBuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await searchSuppliers(q) : [];

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Consulta de fornecedores
        </h1>
        <SignOutButton />
      </div>
      <p className="mb-6 text-sm text-slate-600">
        Busque por razão social ou CNPJ para verificar se um fornecedor está
        homologado.
      </p>

      <form method="get" className="mb-6 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Razão social ou CNPJ"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Buscar
        </button>
      </form>

      {q && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {results.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              Nenhum fornecedor encontrado para &quot;{q}&quot;.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {results.map((supplier) => (
                <li
                  key={supplier.id}
                  className="flex items-center justify-between px-6 py-4"
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
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
