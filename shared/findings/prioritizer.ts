import { Severity, type Finding } from "./types";

const SEVERITY_ORDER: Record<Severity, number> = {
  [Severity.Critical]: 0,
  [Severity.High]: 1,
  [Severity.Medium]: 2,
  [Severity.Low]: 3,
  [Severity.Info]: 4,
};

export function sortBySeverity(findings: Finding[]): Finding[] {
  return [...findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );
}

export function groupByCategory(
  findings: Finding[]
): Map<string, Finding[]> {
  const groups = new Map<string, Finding[]>();

  for (const finding of findings) {
    const group = groups.get(finding.category) ?? [];
    group.push(finding);
    groups.set(finding.category, group);
  }

  return groups;
}

export function deduplicateFindings(findings: Finding[]): Finding[] {
  const seen = new Map<string, Finding>();

  for (const finding of findings) {
    const key = `${finding.title}:${finding.category}`;
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, finding);
    } else {
      // Keep the one with higher severity
      if (SEVERITY_ORDER[finding.severity] < SEVERITY_ORDER[existing.severity]) {
        seen.set(key, finding);
      }
      // Merge evidence
      existing.evidence.push(...finding.evidence);
    }
  }

  return [...seen.values()];
}

export function summarizeFindings(findings: Finding[]) {
  const summary = {
    total: findings.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (const finding of findings) {
    switch (finding.severity) {
      case Severity.Critical:
        summary.critical++;
        break;
      case Severity.High:
        summary.high++;
        break;
      case Severity.Medium:
        summary.medium++;
        break;
      case Severity.Low:
        summary.low++;
        break;
      case Severity.Info:
        summary.info++;
        break;
    }
  }

  return summary;
}
