import type { Finding, FindingsReport } from "../findings";
import { calculateScore, type ScoreBreakdown } from "./score";
import type { ReportMetadata } from "./markdown";
import { summarizeFindings } from "../findings";

interface JsonReportOptions {
  metadata: ReportMetadata;
  findings: Finding[];
}

export interface JsonReport {
  version: string;
  metadata: ReportMetadata;
  score: ScoreBreakdown;
  summary: FindingsReport["summary"];
  findings: Finding[];
}

export function generateJsonReport(options: JsonReportOptions): JsonReport {
  const { metadata, findings } = options;
  const score = calculateScore(findings);
  const summary = summarizeFindings(findings);

  return {
    version: "1.0.0",
    metadata,
    score,
    summary,
    findings,
  };
}

export function generateJsonString(options: JsonReportOptions): string {
  return JSON.stringify(generateJsonReport(options), null, 2);
}
