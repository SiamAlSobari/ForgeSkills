import { describe, it, expect } from "vitest";
import { scanClientConfig } from "../../../skills/ai-audit/reviewer/client-config";
import { scanPromptQuality } from "../../../skills/ai-audit/reviewer/prompt-quality";
import { scanFallbackSafety } from "../../../skills/ai-audit/reviewer/fallback-safety";

describe("ai-audit reviewers", () => {
  const projectRoot = process.cwd();

  describe("scanClientConfig", () => {
    it("returns findings array", async () => {
      const findings = await scanClientConfig(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });

  describe("scanPromptQuality", () => {
    it("returns findings array", async () => {
      const findings = await scanPromptQuality(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });

  describe("scanFallbackSafety", () => {
    it("returns findings array", async () => {
      const findings = await scanFallbackSafety(projectRoot);
      expect(Array.isArray(findings)).toBe(true);
    });
  });
});
