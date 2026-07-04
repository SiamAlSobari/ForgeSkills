import { describe, it, expect, beforeEach } from "vitest";
import {
  Severity,
  Confidence,
  EvidenceType,
  createFinding,
  resetIdCounter,
} from "../../../shared/findings/types";
import { classifyFinding } from "../../../shared/findings/classifier";
import {
  sortBySeverity,
  groupByCategory,
  deduplicateFindings,
  summarizeFindings,
} from "../../../shared/findings/prioritizer";

describe("findings", () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe("createFinding", () => {
    it("creates a finding with auto-generated id", () => {
      const finding = createFinding({
        title: "Test Finding",
        description: "Test description",
        severity: Severity.High,
        confidence: Confidence.High,
        category: "Security",
        evidence: [],
        recommendation: "Fix it",
      });

      expect(finding.id).toBe("F-0001");
      expect(finding.title).toBe("Test Finding");
    });

    it("uses provided id", () => {
      const finding = createFinding({
        id: "CUSTOM-001",
        title: "Test",
        description: "",
        severity: Severity.Low,
        confidence: Confidence.Low,
        category: "",
        evidence: [],
        recommendation: "",
      });

      expect(finding.id).toBe("CUSTOM-001");
    });
  });

  describe("classifyFinding", () => {
    it("classifies SQL injection as Critical", () => {
      const result = classifyFinding({
        category: "Injection",
        title: "sql-injection",
        description: "",
        evidenceType: EvidenceType.CodePattern,
      });

      expect(result.severity).toBe(Severity.Critical);
    });

    it("classifies XSS as High", () => {
      const result = classifyFinding({
        category: "XSS",
        title: "xss",
        description: "",
        evidenceType: EvidenceType.CodePattern,
      });

      expect(result.severity).toBe(Severity.High);
    });

    it("calculates confidence based on evidence type", () => {
      const codeResult = classifyFinding({
        category: "Security",
        title: "test",
        description: "",
        evidenceType: EvidenceType.CodePattern,
      });

      const configResult = classifyFinding({
        category: "Security",
        title: "test",
        description: "",
        evidenceType: EvidenceType.Configuration,
      });

      expect(codeResult.confidence).toBe(Confidence.High);
      expect(configResult.confidence).toBe(Confidence.Medium);
    });
  });

  describe("prioritizer", () => {
    const createTestFinding = (severity: Severity, category: string) =>
      createFinding({
        title: `Finding ${severity}`,
        description: "",
        severity,
        confidence: Confidence.High,
        category,
        evidence: [],
        recommendation: "",
      });

    describe("sortBySeverity", () => {
      it("sorts by severity (Critical first)", () => {
        const findings = [
          createTestFinding(Severity.Low, "A"),
          createTestFinding(Severity.Critical, "B"),
          createTestFinding(Severity.Medium, "C"),
        ];

        const sorted = sortBySeverity(findings);

        expect(sorted[0]!.severity).toBe(Severity.Critical);
        expect(sorted[1]!.severity).toBe(Severity.Medium);
        expect(sorted[2]!.severity).toBe(Severity.Low);
      });
    });

    describe("groupByCategory", () => {
      it("groups findings by category", () => {
        const findings = [
          createTestFinding(Severity.High, "Security"),
          createTestFinding(Severity.Medium, "Security"),
          createTestFinding(Severity.Low, "Performance"),
        ];

        const groups = groupByCategory(findings);

        expect(groups.get("Security")!.length).toBe(2);
        expect(groups.get("Performance")!.length).toBe(1);
      });
    });

    describe("deduplicateFindings", () => {
      it("removes duplicate findings", () => {
        const findings = [
          createTestFinding(Severity.High, "Security"),
          createTestFinding(Severity.Medium, "Security"), // Same title & category
        ];
        // Both have same title "Finding High" - let me fix this
        const findings2 = [
          createFinding({
            title: "Same Issue",
            description: "",
            severity: Severity.High,
            confidence: Confidence.High,
            category: "Security",
            evidence: [],
            recommendation: "",
          }),
          createFinding({
            title: "Same Issue",
            description: "",
            severity: Severity.Medium,
            confidence: Confidence.High,
            category: "Security",
            evidence: [],
            recommendation: "",
          }),
        ];

        const deduplicated = deduplicateFindings(findings2);

        expect(deduplicated.length).toBe(1);
        expect(deduplicated[0]!.severity).toBe(Severity.High); // Keeps higher severity
      });
    });

    describe("summarizeFindings", () => {
      it("counts findings by severity", () => {
        const findings = [
          createTestFinding(Severity.Critical, "A"),
          createTestFinding(Severity.High, "B"),
          createTestFinding(Severity.High, "C"),
          createTestFinding(Severity.Medium, "D"),
          createTestFinding(Severity.Low, "E"),
          createTestFinding(Severity.Info, "F"),
        ];

        const summary = summarizeFindings(findings);

        expect(summary.total).toBe(6);
        expect(summary.critical).toBe(1);
        expect(summary.high).toBe(2);
        expect(summary.medium).toBe(1);
        expect(summary.low).toBe(1);
        expect(summary.info).toBe(1);
      });
    });
  });
});
