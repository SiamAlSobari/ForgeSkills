import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { scanBreakingChanges } from "../../../skills/release-check/reviewer/breaking-change";

describe("release-check reviewers for expanded languages", () => {
  const tempDir = join(process.cwd(), "tests", "fixtures", "temp-release-lang");

  beforeAll(() => {
    mkdirSync(tempDir, { recursive: true });

    // Go file with @deprecated
    writeFileSync(
      join(tempDir, "main.go"),
      `package main
// @deprecated use NewFunc instead
func OldFunc() {}
`
    );

    // Python file with TODO: remove
    writeFileSync(
      join(tempDir, "app.py"),
      `# TODO: remove this function in next release
def temporary():
    pass
`
    );

    // Java file with FIXME: remove
    writeFileSync(
      join(tempDir, "App.java"),
      `public class App {
    // FIXME: remove this method
    public void oldMethod() {}
}
`
    );

    // PHP file with @obsolete
    writeFileSync(
      join(tempDir, "index.php"),
      `<?php
/**
 * @obsolete
 */
function obsoleteFunc() {}
`
    );
  });

  afterAll(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  describe("scanBreakingChanges", () => {
    it("detects deprecated code and removal markers in new supported languages", async () => {
      const findings = await scanBreakingChanges(tempDir);
      const titles = findings.map((f) => f.title);

      // We expect 4 findings total across the 4 files
      expect(findings.length).toBe(4);
      
      const deprecatedFindings = findings.filter((f) => f.title === "Deprecated Code");
      const removalFindings = findings.filter((f) => f.title === "Code Marked for Removal");

      expect(deprecatedFindings.length).toBe(2); // Go (@deprecated) and PHP (@obsolete)
      expect(removalFindings.length).toBe(2);    // Python (TODO: remove) and Java (FIXME: remove)
    });
  });
});
