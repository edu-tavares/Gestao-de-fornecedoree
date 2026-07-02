"use client";

import { useActionState } from "react";
import Link from "next/link";
import { authenticate } from "./actions";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-slate-900">Entrar</h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Ainda não é fornecedor cadastrado?{" "}
          <Link href="/cadastro" className="font-medium text-slate-900 underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
