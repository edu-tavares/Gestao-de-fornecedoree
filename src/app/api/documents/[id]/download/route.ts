import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resolveStoragePath } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    return new NextResponse("Documento não encontrado", { status: 404 });
  }

  const { role, supplierId } = session.user;
  const allowed =
    role === "ADMIN" ||
    (role === "FORNECEDOR" && document.supplierId === supplierId);
  if (!allowed) {
    return new NextResponse("Não autorizado", { status: 403 });
  }

  const buffer = await readFile(resolveStoragePath(document.filePath));
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Disposition": `attachment; filename="${document.fileName}"`,
    },
  });
}
