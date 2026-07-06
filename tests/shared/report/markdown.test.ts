import { describe, it, expect } from "vitest";
import { generateMarkdownReport } from "../../../shared/report/markdown";

describe("Markdown Report Locale Translation", () => {
  it("should output translated headers when id locale is specified", () => {
    const report = generateMarkdownReport({
      metadata: { projectName: "test", projectPath: ".", language: "TypeScript", scanType: "Security Audit", timestamp: "" },
      findings: [],
      locale: "id"
    });
    expect(report).toContain("Laporan Audit Keamanan");
    expect(report).toContain("Skor");
  });
});
