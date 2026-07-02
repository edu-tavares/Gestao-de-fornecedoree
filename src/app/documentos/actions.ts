"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import type { DocumentType } from "@/generated/prisma/enums";
import { REQUIRED_DOCUMENT_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage";

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export async function uploadDocument(
  type: DocumentType,
  _prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (session?.user.role !== "FORNECEDOR" || !session.user.supplierId) {
    return "Não autorizado.";
  }
  if (!REQUIRED_DOCUMENT_TYPES.includes(type)) {
    return "Tipo de documento inválido.";
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return "Selecione um arquivo.";
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Formato não suportado. Envie um PDF, JPG ou PNG.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Arquivo muito grande (máximo 10MB).";
  }

  const supplierId = session.user.supplierId;
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = await saveUploadedFile({
    supplierId,
    type,
    buffer,
    mimeType: file.type,
  });

  await prisma.document.upsert({
    where: { supplierId_type: { supplierId, type } },
    create: {
      supplierId,
      type,
      fileName: file.name,
      filePath,
      mimeType: file.type,
      size: file.size,
      aiStatus: "PENDING",
    },
    update: {
      fileName: file.name,
      filePath,
      mimeType: file.type,
      size: file.size,
      aiStatus: "PENDING",
      aiNotes: null,
      aiConfidence: null,
      aiAnalyzedAt: null,
      uploadedAt: new Date(),
    },
  });

  revalidatePath("/documentos");
  revalidatePath("/dashboard");
}
