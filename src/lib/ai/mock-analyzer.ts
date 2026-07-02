import { createHash } from "node:crypto";
import type { AiAnalysisStatus, DocumentType } from "@/generated/prisma/enums";
import type { AnalysisInput, AnalysisResult, DocumentAnalyzer } from "./types";

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const NOTES_BY_TYPE_AND_STATUS: Record<DocumentType, Record<AiAnalysisStatus, string>> = {
  CONTRATO_SOCIAL: {
    APPROVED: "Contrato social identificado e legível.",
    REJECTED: "Não foi possível identificar as cláusulas do contrato social. Reenvie um documento legível.",
    NEEDS_REVIEW: "Contrato social enviado, mas algumas informações precisam de conferência manual.",
    PENDING: "Aguardando análise.",
  },
  CARTAO_CNPJ: {
    APPROVED: "Cartão CNPJ válido e dados consistentes.",
    REJECTED: "Cartão CNPJ ilegível ou incompleto. Reenvie um documento atualizado.",
    NEEDS_REVIEW: "Cartão CNPJ enviado, mas requer conferência manual dos dados.",
    PENDING: "Aguardando análise.",
  },
  CERTIDAO_NEGATIVA_FEDERAL: {
    APPROVED: "Certidão negativa federal válida e dentro do prazo.",
    REJECTED: "Certidão aparenta estar vencida ou ilegível. Reenvie um documento atualizado.",
    NEEDS_REVIEW: "Certidão federal enviada, mas a validade precisa ser confirmada manualmente.",
    PENDING: "Aguardando análise.",
  },
  CERTIDAO_NEGATIVA_TRABALHISTA: {
    APPROVED: "Certidão negativa trabalhista válida e dentro do prazo.",
    REJECTED: "Certidão aparenta estar vencida ou ilegível. Reenvie um documento atualizado.",
    NEEDS_REVIEW: "Certidão trabalhista enviada, mas a validade precisa ser confirmada manualmente.",
    PENDING: "Aguardando análise.",
  },
  COMPROVANTE_ENDERECO: {
    APPROVED: "Comprovante de endereço válido e recente.",
    REJECTED: "Comprovante de endereço ilegível ou muito antigo. Reenvie um documento mais recente.",
    NEEDS_REVIEW: "Comprovante de endereço enviado, mas requer conferência manual da data.",
    PENDING: "Aguardando análise.",
  },
};

function hashToInt(value: string) {
  const hash = createHash("sha1").update(value).digest("hex");
  return Number.parseInt(hash.slice(0, 8), 16);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAnalyzer implements DocumentAnalyzer {
  async analyzeDocument(input: AnalysisInput): Promise<AnalysisResult> {
    const seed = hashToInt(`${input.filePath}:${input.fileSizeBytes}`);
    await sleep(400 + (seed % 600));

    if (input.fileSizeBytes === 0) {
      return {
        status: "REJECTED",
        notes: "Arquivo vazio.",
        confidence: 0.99,
      };
    }
    if (!ALLOWED_MIME_TYPES.includes(input.mimeType)) {
      return {
        status: "REJECTED",
        notes: "Formato de arquivo não suportado.",
        confidence: 0.95,
      };
    }

    const bucket = seed % 100;
    let status: AiAnalysisStatus;
    let confidenceRange: [number, number];
    if (bucket < 75) {
      status = "APPROVED";
      confidenceRange = [0.85, 0.99];
    } else if (bucket < 90) {
      status = "NEEDS_REVIEW";
      confidenceRange = [0.5, 0.75];
    } else {
      status = "REJECTED";
      confidenceRange = [0.6, 0.95];
    }

    const [min, max] = confidenceRange;
    const confidence = min + ((seed % 1000) / 1000) * (max - min);

    return {
      status,
      notes: NOTES_BY_TYPE_AND_STATUS[input.documentType][status],
      confidence: Number(confidence.toFixed(2)),
    };
  }
}
