import { describe, it, expect } from "vitest";
import { parseNpmAudit, parseSemgrep } from "../../../src/shared/scanners/external";

describe("External Scanners Parser", () => {
  it("should parse npm audit JSON output correctly", () => {
    const mockJson = JSON.stringify({
      vulnerabilities: {
        "lodash": {
          name: "lodash",
          severity: "high",
          via: [{ title: "Prototype Pollution" }],
          effects: [],
          range: "<4.17.21"
        }
      }
    });
    const findings = parseNpmAudit(mockJson);
    expect(findings.length).toBe(1);
    expect(findings[0].title).toBe("lodash vulnerability (high)");
    expect(findings[0].severity).toBe("High");
  });

  it("should parse semgrep JSON output correctly", () => {
    const mockJson = JSON.stringify({
      results: [
        {
          check_id: "rules.xss",
          path: "src/app.js",
          start: { line: 15 },
          extra: {
            message: "Detected potential XSS vulnerability",
            severity: "ERROR",
            lines: "element.innerHTML = input;"
          }
        }
      ]
    });
    const findings = parseSemgrep(mockJson);
    expect(findings.length).toBe(1);
    expect(findings[0].title).toBe("Semgrep: rules.xss");
    expect(findings[0].severity).toBe("High");
  });
});
