import { describe, it, expect, beforeEach } from "vitest";
import { calculateScore } from "../../../shared/report/score";
import { generateMarkdownReport, type ReportMetadata } from "../../../shared/report/markdown";
import { generateJsonReport } from "../../../shared/report/json";
import { Severity, Confidence, EvidenceType, createFinding, resetIdCounter, type Finding } from "../../../shared/findings/types";

describe("report", () => {
  beforeEach(() => {
    resetIdCounter();
  });

  const createTestFinding = (severity: Severity): Finding =>
    createFinding({
      title: `Finding ${severity}`,
      description: `Description for ${severity}`,
      severity,
      confidence: Confidence.High,
      category: "Test",
      evidence: [
        {
          type: EvidenceType.CodePattern,
          file: "test.ts",
          line: 1,
          snippet: "test code",
          description: "evidence",
        },
      ],
      recommendation: "Fix it",
    });

  describe("calculateScore", () => {
    it("returns 100 for no findings", () => {
      const result = calculateScore([]);
      expect(result.score).toBe(100);
      expect(result.grade).toBe("A");
    });

    it("deducts points for Critical findings", () => {
      const findings = [createTestFinding(Severity.Critical)];
      const result = calculateScore(findings);

      expect(result.score).toBe(75); // 100 - 25
      expect(result.grade).toBe("C");
    });

    it("deducts points for High findings", () => {
      const findings = [createTestFinding(Severity.High)];
      const result = calculateScore(findings);

      expect(result.score).toBe(85); // 100 - 15
      expect(result.grade).toBe("B");
    });

    it("caps score at 0", () => {
      const findings = Array(5).fill(createTestFinding(Severity.Critical));
      const result = calculateScore(findings);

      expect(result.score).toBe(0);
      expect(result.grade).toBe("F");
    });

    it("calculates correct grade", () => {
      expect(calculateScore([]).grade).toBe("A"); // 100
      expect(calculateScore([createTestFinding(Severity.Medium)]).grade).toBe("A"); // 92
      expect(calculateScore([createTestFinding(Severity.Critical)]).grade).toBe("C"); // 75
    });
  });

  describe("generateMarkdownReport", () => {
    it("generates report with all sections", () => {
      const metadata: ReportMetadata = {
        projectName: "test-project",
        projectPath: "/path/to/project",
        language: "TypeScript",
        framework: "Express",
        scanType: "Security Audit",
        timestamp: "2024-01-15T00:00:00Z",
      };

      const findings = [
        createTestFinding(Severity.Critical),
        createTestFinding(Severity.High),
      ];

      const report = generateMarkdownReport({ metadata, findings });

      expect(report).toContain("# Security Audit Report");
      expect(report).toContain("test-project");
      expect(report).toContain("TypeScript");
      expect(report).toContain("Express");
      expect(report).toContain("Critical Findings");
      expect(report).toContain("High Findings");
    });
  });

  describe("generateJsonReport", () => {
    it("generates valid JSON report", () => {
      const metadata: ReportMetadata = {
        projectName: "test-project",
        projectPath: "/path/to/project",
        language: "TypeScript",
        scanType: "Security Audit",
        timestamp: "2024-01-15T00:00:00Z",
      };

      const findings = [createTestFinding(Severity.High)];
      const report = generateJsonReport({ metadata, findings });

      expect(report.version).toBe("1.0.0");
      expect(report.metadata.projectName).toBe("test-project");
      expect(report.findings.length).toBe(1);
      expect(report.summary.total).toBe(1);
      expect(report.summary.high).toBe(1);
    });
  });
});
