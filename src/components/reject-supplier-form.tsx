"use client";

import { useActionState } from "react";
import { rejectSupplier } from "@/app/admin/fornecedores/[id]/actions";

export function RejectSupplierForm({ supplierId }: { supplierId: string }) {
  const action = rejectSupplier.bind(null, supplierId);
  const [error, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-2">
      <textarea
        name="reason"
        required
        rows={2}
        placeholder="Motivo da rejeição"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
      >
        {isPending ? "Rejeitando..." : "Rejeitar"}
      </button>
    </form>
  );
}
