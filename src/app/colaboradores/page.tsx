import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { EmployeeForm } from "@/components/employee-form";
import { SUPPLIER_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { toggleEmployeeActive } from "./actions";

export default async function ColaboradoresPage() {
  const session = await auth();
  const supplierId = session!.user.supplierId!;

  const supplier = await prisma.supplier.findUniqueOrThrow({
    where: { id: supplierId },
  });

  if (supplier.status !== "APROVADO") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            Colaboradores
          </h1>
          <SignOutButton />
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          O cadastro de colaboradores fica disponível somente após a
          homologação da empresa. Status atual:{" "}
          <strong>{SUPPLIER_STATUS_LABELS[supplier.status]}</strong>.
        </div>
      </main>
    );
  }

  const employees = await prisma.employee.findMany({
    where: { supplierId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Colaboradores
        </h1>
        <SignOutButton />
      </div>

      <div className="mb-6">
        <EmployeeForm />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {employees.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Nenhum colaborador cadastrado ainda.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {employees.map((employee) => (
              <li key={employee.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {employee.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {employee.cargo} · CPF {employee.cpf}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      employee.active
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {employee.active ? "Ativo" : "Inativo"}
                  </span>
                  <form action={toggleEmployeeActive.bind(null, employee.id)}>
                    <button
                      type="submit"
                      className="text-xs font-medium text-slate-900 underline"
                    >
                      {employee.active ? "Desativar" : "Reativar"}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
