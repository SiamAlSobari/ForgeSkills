import { describe, it, expect } from "vitest";
import { scanErrorLogs } from "../../../skills/bug-investigate/reviewer/error-log";
import { scanCodePaths } from "../../../skills/bug-investigate/reviewer/code-path";
import { scanEdgeCases } from "../../../skills/bug-investigate/reviewer/edge-case";

describe("bug-investigate reviewers", () => {
  const projectRoot = process.cwd();

  describe("scanErrorLogs", () => {
    it("returns findings array", async () => {
      const findings = await scanErrorLogs(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });

  describe("scanCodePaths", () => {
    it("returns findings array", async () => {
      const findings = await scanCodePaths(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });

  describe("scanEdgeCases", () => {
    it("returns findings array", async () => {
      const findings = await scanEdgeCases(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });
});
