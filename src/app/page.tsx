import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { homeForRole } from "@/lib/roles";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect(homeForRole(session.user.role));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-slate-900">
        Gestão de Fornecedores
      </h1>
      <p className="mt-4 max-w-md text-slate-600">
        Cadastre sua empresa, envie os documentos exigidos e acompanhe o
        processo de homologação para prestar serviços.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/cadastro"
          className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Cadastrar fornecedor
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
