import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { homeForRole } from "@/lib/roles";

const FORNECEDOR_PREFIXES = ["/dashboard", "/documentos", "/colaboradores"];
const ADMIN_PREFIX = "/admin";
const CONSULTA_PREFIX = "/consulta";

function matchesPrefix(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isFornecedorRoute = FORNECEDOR_PREFIXES.some((prefix) =>
    matchesPrefix(path, prefix),
  );
  const isAdminRoute = matchesPrefix(path, ADMIN_PREFIX);
  const isConsultaRoute = matchesPrefix(path, CONSULTA_PREFIX);

  if (!isFornecedorRoute && !isAdminRoute && !isConsultaRoute) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  const allowed =
    (isFornecedorRoute && role === "FORNECEDOR") ||
    (isAdminRoute && role === "ADMIN") ||
    (isConsultaRoute && (role === "CONTRATANTE_VIEWER" || role === "ADMIN"));

  if (!allowed) {
    return NextResponse.redirect(new URL(homeForRole(role!), nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/documentos/:path*",
    "/colaboradores/:path*",
    "/admin/:path*",
    "/consulta/:path*",
  ],
};
