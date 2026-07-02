"use client";

import { useActionState } from "react";
import type { DocumentType, AiAnalysisStatus } from "@/generated/prisma/enums";
import { uploadDocument } from "@/app/documentos/actions";
import { AI_STATUS_LABELS, AI_STATUS_STYLES } from "@/lib/constants";

export function DocumentUploadRow({
  type,
  label,
  currentDocument,
}: {
  type: DocumentType;
  label: string;
  currentDocument: {
    fileName: string;
    aiStatus: AiAnalysisStatus;
    aiNotes: string | null;
  } | null;
}) {
  const action = uploadDocument.bind(null, type);
  const [error, formAction, isPending] = useActionState(action, undefined);

  return (
    <li className="flex flex-col gap-2 border-b border-slate-100 py-4 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        {currentDocument ? (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${AI_STATUS_STYLES[currentDocument.aiStatus]}`}
          >
            {AI_STATUS_LABELS[currentDocument.aiStatus]}
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            Não enviado
          </span>
        )}
      </div>

      {currentDocument && (
        <div className="text-xs text-slate-500">
          Arquivo atual: {currentDocument.fileName}
          {currentDocument.aiNotes && (
            <p className="mt-1 text-slate-600">{currentDocument.aiNotes}</p>
          )}
        </div>
      )}

      <form action={formAction} className="flex items-center gap-2">
        <input
          type="file"
          name="file"
          accept="application/pdf,image/jpeg,image/png"
          required
          className="flex-1 text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isPending ? "Enviando..." : currentDocument ? "Reenviar" : "Enviar"}
        </button>
      </form>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </li>
  );
}
