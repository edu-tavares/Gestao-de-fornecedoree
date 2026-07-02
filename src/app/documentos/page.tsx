import { auth } from "@/auth";
import { DocumentUploadRow } from "@/components/document-upload-row";
import { SignOutButton } from "@/components/sign-out-button";
import { DOCUMENT_TYPE_LABELS, REQUIRED_DOCUMENT_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function DocumentosPage() {
  const session = await auth();
  const supplierId = session!.user.supplierId!;

  const documents = await prisma.document.findMany({
    where: { supplierId },
  });
  const documentsByType = new Map(documents.map((doc) => [doc.type, doc]));

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Documentos da empresa
        </h1>
        <SignOutButton />
      </div>
      <p className="mb-6 text-sm text-slate-600">
        Envie os documentos abaixo em PDF, JPG ou PNG (máx. 10MB cada). Após o
        envio, cada documento passa por uma análise automática.
      </p>

      <ul className="rounded-lg border border-slate-200 bg-white px-6">
        {REQUIRED_DOCUMENT_TYPES.map((type) => (
          <DocumentUploadRow
            key={type}
            type={type}
            label={DOCUMENT_TYPE_LABELS[type]}
            currentDocument={documentsByType.get(type) ?? null}
          />
        ))}
      </ul>
    </main>
  );
}
