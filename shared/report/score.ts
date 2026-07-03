import { Severity, type Finding } from "../findings";

const SEVERITY_WEIGHTS: Record<Severity, number> = {
  [Severity.Critical]: 25,
  [Severity.High]: 15,
  [Severity.Medium]: 8,
  [Severity.Low]: 3,
  [Severity.Info]: 0,
};

export interface ScoreBreakdown {
  total: number;
  deduction: number;
  score: number;
  grade: string;
  breakdown: Record<Severity, number>;
}

export function calculateScore(findings: Finding[]): ScoreBreakdown {
  const breakdown: Record<Severity, number> = {
    [Severity.Critical]: 0,
    [Severity.High]: 0,
    [Severity.Medium]: 0,
    [Severity.Low]: 0,
    [Severity.Info]: 0,
  };

  for (const finding of findings) {
    breakdown[finding.severity]++;
  }

  let deduction = 0;
  for (const [severity, count] of Object.entries(breakdown)) {
    deduction += count * SEVERITY_WEIGHTS[severity as Severity];
  }

  // Cap deduction at 100
  const score = Math.max(0, Math.min(100, 100 - deduction));

  let grade: string;
  if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";
  else grade = "F";

  return {
    total: findings.length,
    deduction,
    score,
    grade,
    breakdown,
  };
}
