import { describe, it, expect } from "vitest";
import { join } from "path";
import { scanForSecrets } from "../../../skills/security-audit/reviewer/secrets";
import { scanSourceCode } from "../../../skills/security-audit/reviewer/source-code";
import { scanConfigs } from "../../../skills/security-audit/reviewer/config-review";

describe("security-audit reviewers", () => {
  // These tests use the actual project directory
  // In production, you'd use test fixtures
  const projectRoot = process.cwd();

  describe("scanForSecrets", () => {
    it("returns findings array", async () => {
      const findings = await scanForSecrets(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });

  describe("scanSourceCode", () => {
    it("returns findings array", async () => {
      const findings = await scanSourceCode(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });

  describe("scanConfigs", () => {
    it("returns findings array", async () => {
      const findings = await scanConfigs(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });
});
