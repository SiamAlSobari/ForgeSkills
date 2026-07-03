import { Confidence, EvidenceType, Severity, type Finding } from "./types";

interface ClassifyInput {
  category: string;
  title: string;
  description: string;
  evidenceType: EvidenceType;
  context?: {
    isProduction?: boolean;
    isPublicFacing?: boolean;
    hasAuthentication?: boolean;
    dataType?: "pii" | "financial" | "health" | "general";
  };
}

const SEVERITY_RULES: Record<string, Severity> = {
  // Critical
  "sql-injection": Severity.Critical,
  "rce": Severity.Critical,
  "authentication-bypass": Severity.Critical,
  "hardcoded-secret": Severity.Critical,
  "private-key-exposure": Severity.Critical,

  // High
  "xss": Severity.High,
  "csrf": Severity.High,
  "ssrf": Severity.High,
  "path-traversal": Severity.High,
  "unsafe-deserialization": Severity.High,
  "missing-authentication": Severity.High,

  // Medium
  "missing-validation": Severity.Medium,
  "weak-crypto": Severity.Medium,
  "debug-mode": Severity.Medium,
  "verbose-error": Severity.Medium,
  "missing-rate-limit": Severity.Medium,
  "n-plus-one-query": Severity.Medium,

  // Low
  "missing-header": Severity.Low,
  "deprecated-api": Severity.Low,
  "unused-import": Severity.Low,
  "naming-convention": Severity.Low,

  // Info
  "best-practice": Severity.Info,
  "suggestion": Severity.Info,
};

export function classifySeverity(input: ClassifyInput): Severity {
  const normalized = input.title.toLowerCase().replace(/\s+/g, "-");
  const base = SEVERITY_RULES[normalized] ?? Severity.Medium;

  // Elevate severity based on context
  if (input.context) {
    const { isPublicFacing, dataType } = input.context;

    if (isPublicFacing && base === Severity.Medium) {
      return Severity.High;
    }

    if ((dataType === "pii" || dataType === "financial" || dataType === "health") && base !== Severity.Critical) {
      const order = [Severity.Info, Severity.Low, Severity.Medium, Severity.High, Severity.Critical];
      const idx = order.indexOf(base);
      if (idx < order.length - 1) return order[idx + 1]!;
    }
  }

  return base;
}

export function calculateConfidence(input: ClassifyInput): Confidence {
  // Code patterns with specific evidence = high confidence
  if (input.evidenceType === EvidenceType.CodePattern) {
    return Confidence.High;
  }

  // Configuration issues = medium confidence
  if (input.evidenceType === EvidenceType.Configuration) {
    return Confidence.Medium;
  }

  // Dependency or structure-based = lower confidence
  return Confidence.Low;
}

export function classifyFinding(
  input: ClassifyInput
): { severity: Severity; confidence: Confidence } {
  return {
    severity: classifySeverity(input),
    confidence: calculateConfidence(input),
  };
}
