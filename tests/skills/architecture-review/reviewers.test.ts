import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { scanDebt } from "../../../skills/architecture-review/reviewer/debt";
import { scanModularity } from "../../../skills/architecture-review/reviewer/modularity";
import { scanPatterns } from "../../../skills/architecture-review/reviewer/pattern";
import { scanSeparation } from "../../../skills/architecture-review/reviewer/separation";
import { scanSOLID } from "../../../skills/architecture-review/reviewer/solid";

describe("architecture-review reviewers for expanded languages", () => {
  const tempDir = join(process.cwd(), "tests", "fixtures", "temp-arch-lang");

  beforeAll(() => {
    mkdirSync(tempDir, { recursive: true });

    // Python file with print statement without parentheses and xrange
    writeFileSync(
      join(tempDir, "script.py"),
      `# Python 2 style print and xrange
print "Hello, world!"
for i in xrange(10):
    pass
`
    );

    // Go file using ioutil
    writeFileSync(
      join(tempDir, "main.go"),
      `package main
import "io/ioutil"
func main() {
    _, _ = ioutil.ReadFile("test.txt")
}
`
    );

    // PHP file using mysql_connect and var_dump
    writeFileSync(
      join(tempDir, "db.php"),
      `<?php
$conn = mysql_connect("localhost", "user", "pass");
var_dump($conn);
`
    );

    // Java file (just to verify Java files are checked)
    writeFileSync(
      join(tempDir, "App.java"),
      `public class App {
    // TODO: implement this class
}
`
    );
  });

  afterAll(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  describe("scanDebt", () => {
    it("detects Python, Go, and PHP deprecated patterns", async () => {
      const findings = await scanDebt(tempDir);
      
      const titles = findings.map(f => f.title);
      expect(titles).toContain("Deprecated Pattern: Python 2 style print");
      expect(titles).toContain("Deprecated Pattern: xrange");
      expect(titles).toContain("Deprecated Pattern: ioutil");
      expect(titles).toContain("Deprecated Pattern: mysql_connect");
      expect(titles).toContain("Deprecated Pattern: var_dump");

      // Verify TODO in Java file is also detected as technical debt
      expect(titles).toContain("TODO/FIXME Comment");
    });
  });

  describe("other reviewers", () => {
    it("execute without error on expanded language files", async () => {
      const modularity = await scanModularity(tempDir);
      const patterns = await scanPatterns(tempDir);
      const separation = await scanSeparation(tempDir);
      const solid = await scanSOLID(tempDir);

      expect(Array.isArray(modularity)).toBe(true);
      expect(Array.isArray(patterns)).toBe(true);
      expect(Array.isArray(separation)).toBe(true);
      expect(Array.isArray(solid)).toBe(true);
    });
  });
});
