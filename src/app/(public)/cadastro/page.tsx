"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ESTADOS_BR } from "@/lib/constants";
import { registerSupplier } from "./actions";

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
    </div>
  );
}

export default function CadastroPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    registerSupplier,
    undefined,
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-xl font-semibold text-slate-900">
        Cadastro de fornecedor
      </h1>
      <p className="mb-6 text-sm text-slate-600">
        Preencha os dados da empresa. Após o cadastro você poderá enviar os
        documentos exigidos para homologação.
      </p>

      <form action={formAction} className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="mb-2 text-sm font-semibold text-slate-900">
            Dados da empresa
          </legend>
          <Field label="Razão social" name="razaoSocial" />
          <Field label="Nome fantasia (opcional)" name="nomeFantasia" required={false} />
          <Field label="CNPJ" name="cnpj" />
          <Field label="Telefone" name="telefone" />
          <Field label="Endereço" name="endereco" />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Cidade" name="cidade" />
            <div>
              <label htmlFor="estado" className="mb-1 block text-sm font-medium text-slate-700">
                UF
              </label>
              <select
                id="estado"
                name="estado"
                required
                defaultValue=""
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                <option value="" disabled>
                  UF
                </option>
                {ESTADOS_BR.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <Field label="CEP" name="cep" />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-2 text-sm font-semibold text-slate-900">
            Acesso ao sistema
          </legend>
          <Field label="Nome do responsável" name="name" />
          <Field label="E-mail" name="email" type="email" />
          <Field label="Senha" name="password" type="password" />
          <Field label="Confirmar senha" name="confirmPassword" type="password" />
        </fieldset>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isPending ? "Enviando..." : "Cadastrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-slate-900 underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
