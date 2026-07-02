import Link from "next/link";
import { notFound } from "next/navigation";
import { RejectSupplierForm } from "@/components/reject-supplier-form";
import { SignOutButton } from "@/components/sign-out-button";
import {
  AI_STATUS_LABELS,
  AI_STATUS_STYLES,
  DOCUMENT_TYPE_LABELS,
  REQUIRED_DOCUMENT_TYPES,
  SUPPLIER_STATUS_LABELS,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { approveSupplier } from "./actions";

const STATUS_BADGE_STYLES = {
  PENDENTE: "bg-slate-100 text-slate-700",
  EM_ANALISE: "bg-amber-100 text-amber-800",
  APROVADO: "bg-green-100 text-green-800",
  REJEITADO: "bg-red-100 text-red-800",
};

export default async function AdminFornecedorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: { documents: true, reviewedBy: true },
  });
  if (!supplier) notFound();

  const documentsByType = new Map(
    supplier.documents.map((doc) => [doc.type, doc]),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/fornecedores" className="text-sm text-slate-500 underline">
          &larr; Fornecedores
        </Link>
        <SignOutButton />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {supplier.razaoSocial}
          </h1>
          <p className="text-sm text-slate-500">{supplier.cnpj}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_STYLES[supplier.status]}`}
        >
          {SUPPLIER_STATUS_LABELS[supplier.status]}
        </span>
      </div>

      <section className="mb-6 grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg border border-slate-200 bg-white p-6 text-sm">
        <div>
          <dt className="text-slate-500">Nome fantasia</dt>
          <dd className="text-slate-900">{supplier.nomeFantasia || "-"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">E-mail</dt>
          <dd className="text-slate-900">{supplier.email}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Telefone</dt>
          <dd className="text-slate-900">{supplier.telefone}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Endereço</dt>
          <dd className="text-slate-900">
            {supplier.endereco}, {supplier.cidade}/{supplier.estado} - {supplier.cep}
          </dd>
        </div>
        {supplier.reviewedBy && (
          <div className="col-span-2">
            <dt className="text-slate-500">Revisado por</dt>
            <dd className="text-slate-900">
              {supplier.reviewedBy.name} em{" "}
              {supplier.reviewedAt?.toLocaleString("pt-BR")}
            </dd>
          </div>
        )}
        {supplier.status === "REJEITADO" && supplier.rejectionReason && (
          <div className="col-span-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
            <strong>Motivo da rejeição:</strong> {supplier.rejectionReason}
          </div>
        )}
      </section>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Documentos
        </h2>
        <ul className="divide-y divide-slate-100">
          {REQUIRED_DOCUMENT_TYPES.map((type) => {
            const doc = documentsByType.get(type);
            return (
              <li key={type} className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    {DOCUMENT_TYPE_LABELS[type]}
                  </span>
                  {doc ? (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${AI_STATUS_STYLES[doc.aiStatus]}`}
                    >
                      {AI_STATUS_LABELS[doc.aiStatus]}
                      {doc.aiConfidence != null &&
                        ` (${Math.round(doc.aiConfidence * 100)}%)`}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                      Não enviado
                    </span>
                  )}
                </div>
                {doc && (
                  <div className="text-xs text-slate-500">
                    {doc.aiNotes && <p>{doc.aiNotes}</p>}
                    <a
                      href={`/api/documents/${doc.id}/download`}
                      className="font-medium text-slate-900 underline"
                    >
                      Baixar arquivo
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {(supplier.status === "EM_ANALISE" || supplier.status === "PENDENTE") && (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Homologação
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <form action={approveSupplier.bind(null, supplier.id)}>
              <button
                type="submit"
                className="rounded-md bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800"
              >
                Aprovar (homologar)
              </button>
            </form>
            <div className="w-full sm:max-w-xs">
              <RejectSupplierForm supplierId={supplier.id} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
