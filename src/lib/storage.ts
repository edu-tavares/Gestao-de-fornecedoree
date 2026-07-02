import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DocumentType } from "@/generated/prisma/enums";

const STORAGE_ROOT = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "storage",
  "uploads",
);

const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

export function resolveStoragePath(relativePath: string) {
  return path.join(STORAGE_ROOT, relativePath);
}

export async function saveUploadedFile({
  supplierId,
  type,
  buffer,
  mimeType,
}: {
  supplierId: string;
  type: DocumentType;
  buffer: Buffer;
  mimeType: string;
}) {
  const extension = EXTENSION_BY_MIME[mimeType] ?? "";
  const relativePath = path.join(supplierId, `${type}${extension}`);
  const absolutePath = resolveStoragePath(relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buffer);

  return relativePath;
}
