import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { DOCUMENT_TYPE_LABELS, REQUIRED_DOCUMENT_TYPES, SUPPLIER_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const STATUS_BADGE_STYLES = {
  PENDENTE: "bg-slate-100 text-slate-700",
  EM_ANALISE: "bg-amber-100 text-amber-800",
  APROVADO: "bg-green-100 text-green-800",
  REJEITADO: "bg-red-100 text-red-800",
};

export default async function FornecedorDashboardPage() {
  const session = await auth();
  const supplierId = session!.user.supplierId!;

  const supplier = await prisma.supplier.findUniqueOrThrow({
    where: { id: supplierId },
    include: { documents: true },
  });

  const documentsByType = new Map(
    supplier.documents.map((doc) => [doc.type, doc]),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {supplier.razaoSocial}
          </h1>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_STYLES[supplier.status]}`}
          >
            {SUPPLIER_STATUS_LABELS[supplier.status]}
          </span>
        </div>
        <SignOutButton />
      </div>

      {supplier.status === "REJEITADO" && supplier.rejectionReason && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <strong>Motivo da rejeição:</strong> {supplier.rejectionReason}
        </div>
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Documentos obrigatórios
        </h2>
        <ul className="divide-y divide-slate-100">
          {REQUIRED_DOCUMENT_TYPES.map((type) => {
            const doc = documentsByType.get(type);
            return (
              <li key={type} className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-700">
                  {DOCUMENT_TYPE_LABELS[type]}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {doc ? doc.aiStatus : "Não enviado"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
