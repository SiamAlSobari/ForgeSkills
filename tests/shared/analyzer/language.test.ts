import { describe, it, expect } from "vitest";
import { calculateLanguageDistribution, mapExtensionToLanguage } from "../../../shared/analyzer/language";

describe("language", () => {
  describe("mapExtensionToLanguage", () => {
    it("maps .ts to TypeScript", () => {
      expect(mapExtensionToLanguage(".ts")).toBe("TypeScript");
    });

    it("maps .js to JavaScript", () => {
      expect(mapExtensionToLanguage(".js")).toBe("JavaScript");
    });

    it("maps .py to Python", () => {
      expect(mapExtensionToLanguage(".py")).toBe("Python");
    });

    it("maps .go to Go", () => {
      expect(mapExtensionToLanguage(".go")).toBe("Go");
    });

    it("returns null for unknown extension", () => {
      expect(mapExtensionToLanguage(".xyz")).toBeNull();
    });
  });

  describe("calculateLanguageDistribution", () => {
    it("identifies primary language", () => {
      const files = ["index.ts", "utils.ts", "helper.ts", "style.css"];
      const result = calculateLanguageDistribution(files);

      expect(result.primary.name).toBe("TypeScript");
      expect(result.primary.fileCount).toBe(3);
      expect(result.primary.percentage).toBe(75);
    });

    it("calculates secondary languages", () => {
      const files = ["index.ts", "utils.ts", "style.css", "app.css"];
      const result = calculateLanguageDistribution(files);

      expect(result.secondary.length).toBeGreaterThan(0);
      expect(result.secondary[0]!.name).toBe("CSS");
    });

    it("handles empty file list", () => {
      const result = calculateLanguageDistribution([]);

      expect(result.primary.name).toBe("Unknown");
      expect(result.total).toBe(0);
    });

    it("handles single file", () => {
      const files = ["index.ts"];
      const result = calculateLanguageDistribution(files);

      expect(result.primary.name).toBe("TypeScript");
      expect(result.primary.percentage).toBe(100);
    });
  });
});
