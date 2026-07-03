import { Severity, type Finding, type FindingsReport } from "../findings";
import { calculateScore, type ScoreBreakdown } from "./score";

export interface ReportMetadata {
  projectName: string;
  projectPath: string;
  language: string;
  framework?: string;
  scanType: string;
  timestamp: string;
}

interface MarkdownReportOptions {
  metadata: ReportMetadata;
  findings: Finding[];
  includeRecommendations?: boolean;
  includeCodeSnippets?: boolean;
}

const SEVERITY_EMOJI: Record<Severity, string> = {
  [Severity.Critical]: "\u{1F534}",
  [Severity.High]: "\u{1F7E0}",
  [Severity.Medium]: "\u{1F7E1}",
  [Severity.Low]: "\u{1F535}",
  [Severity.Info]: "\u26AA",
};

export function generateMarkdownReport(options: MarkdownReportOptions): string {
  const { metadata, findings, includeRecommendations = true, includeCodeSnippets = true } = options;
  const score = calculateScore(findings);
  const sections: string[] = [];

  // Header
  sections.push(`# ${metadata.scanType} Report\n`);
  sections.push(`**Project:** ${metadata.projectName}`);
  sections.push(`**Path:** ${metadata.projectPath}`);
  sections.push(`**Language:** ${metadata.language}`);
  if (metadata.framework) sections.push(`**Framework:** ${metadata.framework}`);
  sections.push(`**Date:** ${metadata.timestamp}\n`);

  // Score
  sections.push(`## Score\n`);
  sections.push(`**${score.score}/100** (Grade: ${score.grade})\n`);
  sections.push(`| Severity | Count |`);
  sections.push(`|----------|-------|`);
  for (const [severity, count] of Object.entries(score.breakdown)) {
    if (count > 0) {
      sections.push(`| ${SEVERITY_EMOJI[severity as Severity]} ${severity} | ${count} |`);
    }
  }
  sections.push("");

  // Executive Summary
  sections.push(`## Executive Summary\n`);
  sections.push(
    `Found **${findings.length}** issues: **${score.breakdown[Severity.Critical]}** critical, **${score.breakdown[Severity.High]}** high, **${score.breakdown[Severity.Medium]}** medium, **${score.breakdown[Severity.Low]}** low, **${score.breakdown[Severity.Info]}** info.\n`
  );

  // Findings by severity
  const grouped = new Map<Severity, Finding[]>();
  for (const finding of findings) {
    const group = grouped.get(finding.severity) ?? [];
    group.push(finding);
    grouped.set(finding.severity, group);
  }

  for (const severity of [Severity.Critical, Severity.High, Severity.Medium, Severity.Low, Severity.Info]) {
    const group = grouped.get(severity);
    if (!group || group.length === 0) continue;

    sections.push(`## ${SEVERITY_EMOJI[severity]} ${severity} Findings\n`);

    for (const finding of group) {
      sections.push(`### ${finding.title}\n`);
      sections.push(`**Category:** ${finding.category}`);
      sections.push(`**Confidence:** ${finding.confidence}\n`);
      sections.push(finding.description + "\n");

      if (includeCodeSnippets && finding.evidence.length > 0) {
        sections.push(`**Evidence:**\n`);
        for (const ev of finding.evidence) {
          sections.push(`- \`${ev.file}\`${ev.line ? ` (line ${ev.line})` : ""}`);
          if (ev.snippet) {
            sections.push("```");
            sections.push(ev.snippet);
            sections.push("```\n");
          }
        }
      }

      if (includeRecommendations) {
        sections.push(`**Recommendation:**\n${finding.recommendation}\n`);
      }
    }
  }

  return sections.join("\n");
}
