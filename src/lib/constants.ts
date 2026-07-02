import type { DocumentType } from "@/generated/prisma/enums";

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

export const ESTADOS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];
