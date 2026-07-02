import type { AiAnalysisStatus, DocumentType } from "@/generated/prisma/enums";

export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  "CONTRATO_SOCIAL",
  "CARTAO_CNPJ",
  "CERTIDAO_NEGATIVA_FEDERAL",
  "CERTIDAO_NEGATIVA_TRABALHISTA",
  "COMPROVANTE_ENDERECO",
];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  CONTRATO_SOCIAL: "Contrato Social",
  CARTAO_CNPJ: "Cartão CNPJ",
  CERTIDAO_NEGATIVA_FEDERAL: "Certidão Negativa Federal",
  CERTIDAO_NEGATIVA_TRABALHISTA: "Certidão Negativa Trabalhista",
  COMPROVANTE_ENDERECO: "Comprovante de Endereço",
};

export const SUPPLIER_STATUS_LABELS = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em análise",
  APROVADO: "Homologado",
  REJEITADO: "Rejeitado",
} as const;

export const AI_STATUS_LABELS: Record<AiAnalysisStatus, string> = {
  PENDING: "Analisando...",
  APPROVED: "Aprovado pela IA",
  REJECTED: "Rejeitado pela IA",
  NEEDS_REVIEW: "Requer revisão",
};

export const AI_STATUS_STYLES: Record<AiAnalysisStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  NEEDS_REVIEW: "bg-amber-100 text-amber-800",
};

export const ESTADOS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];
