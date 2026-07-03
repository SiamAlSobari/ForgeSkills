export enum Severity {
  Critical = "Critical",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Info = "Info",
}

export enum Confidence {
  High = "High",
  Medium = "Medium",
  Low = "Low",
}

export enum EvidenceType {
  CodePattern = "CodePattern",
  Configuration = "Configuration",
  Dependency = "Dependency",
  FileStructure = "FileStructure",
  Behavior = "Behavior",
}

export interface Evidence {
  type: EvidenceType;
  file: string;
  line?: number;
  snippet?: string;
  description: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: Confidence;
  category: string;
  evidence: Evidence[];
  recommendation: string;
  references?: string[];
}

export interface FindingsReport {
  findings: Finding[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export function createFinding(
  partial: Omit<Finding, "id"> & { id?: string }
): Finding {
  return {
    id: partial.id ?? generateId(),
    ...partial,
  };
}

let counter = 0;
function generateId(): string {
  return `F-${String(++counter).padStart(4, "0")}`;
}

export function resetIdCounter(): void {
  counter = 0;
}
