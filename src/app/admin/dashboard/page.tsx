import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Painel do administrador
        </h1>
        <SignOutButton />
      </div>
      <p className="text-slate-600">
        Logado como {session?.user?.name} ({session?.user?.role}).
      </p>
    </main>
  );
}
