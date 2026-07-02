"use client";

import { useActionState, useRef } from "react";
import { createEmployee } from "@/app/colaboradores/actions";

export function EmployeeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, formAction, isPending] = useActionState(
    async (prevState: string | undefined, formData: FormData) => {
      const result = await createEmployee(prevState, formData);
      if (!result) {
        formRef.current?.reset();
      }
      return result;
    },
    undefined,
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cpf" className="mb-1 block text-sm font-medium text-slate-700">
            CPF
          </label>
          <input
            id="cpf"
            name="cpf"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cargo" className="mb-1 block text-sm font-medium text-slate-700">
            Cargo/função
          </label>
          <input
            id="cargo"
            name="cargo"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="telefone" className="mb-1 block text-sm font-medium text-slate-700">
            Telefone (opcional)
          </label>
          <input
            id="telefone"
            name="telefone"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            E-mail (opcional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isPending ? "Cadastrando..." : "Cadastrar colaborador"}
      </button>
    </form>
  );
}
