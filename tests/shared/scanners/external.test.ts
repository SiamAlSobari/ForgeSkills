import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseNpmAudit, parseSemgrep, runNpmAudit, runSemgrep } from "../../../src/shared/scanners/external";
import { execSync } from "child_process";

vi.mock("child_process", () => {
  return {
    execSync: vi.fn(),
  };
});

describe("External Scanners Parser", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  describe("runNpmAudit", () => {
    it("should return findings if execSync succeeds", () => {
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
      (execSync as any).mockReturnValue(mockJson);

      const findings = runNpmAudit("mock-path");
      expect(findings.length).toBe(1);
      expect(execSync).toHaveBeenCalledWith("npm audit --json", expect.any(Object));
    });

    it("should print warning and return empty findings if execSync fails with no stdout", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      (execSync as any).mockImplementation(() => {
        throw new Error("Command failed");
      });

      const findings = runNpmAudit("mock-path");
      expect(findings).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith("⚠️ Warning: 'npm' command not found or failed to execute. Skipping dependency audit.");
      warnSpy.mockRestore();
    });

    it("should parse stdout and not print warning if execSync fails but contains stdout", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
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
      const error: any = new Error("Command failed");
      error.stdout = Buffer.from(mockJson);
      (execSync as any).mockImplementation(() => {
        throw error;
      });

      const findings = runNpmAudit("mock-path");
      expect(findings.length).toBe(1);
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe("runSemgrep", () => {
    it("should return findings if execSync succeeds", () => {
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
      (execSync as any).mockReturnValue(mockJson);

      const findings = runSemgrep("mock-path");
      expect(findings.length).toBe(1);
      expect(execSync).toHaveBeenCalledWith("semgrep --json --config=auto", expect.any(Object));
    });

    it("should print warning and return empty findings if execSync fails with no stdout", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      (execSync as any).mockImplementation(() => {
        throw new Error("Command failed");
      });

      const findings = runSemgrep("mock-path");
      expect(findings).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith("⚠️ Warning: 'semgrep' command not found or failed to execute. Skipping static code review.");
      warnSpy.mockRestore();
    });

    it("should parse stdout and not print warning if execSync fails but contains stdout", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
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
      const error: any = new Error("Command failed");
      error.stdout = Buffer.from(mockJson);
      (execSync as any).mockImplementation(() => {
        throw error;
      });

      const findings = runSemgrep("mock-path");
      expect(findings.length).toBe(1);
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
