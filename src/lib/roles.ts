import type { Role } from "@/generated/prisma/enums";

export function homeForRole(role: Role) {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "CONTRATANTE_VIEWER") return "/consulta/buscar";
  return "/dashboard";
}
