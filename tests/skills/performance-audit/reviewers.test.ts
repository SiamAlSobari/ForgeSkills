import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { scanMemory } from "../../../skills/performance-audit/reviewer/memory";
import { scanAlgorithms } from "../../../skills/performance-audit/reviewer/algorithm";
import { scanCaching } from "../../../skills/performance-audit/reviewer/caching";
import { scanQueries } from "../../../skills/performance-audit/reviewer/query";
import { scanResources } from "../../../skills/performance-audit/reviewer/resource";

describe("performance-audit reviewers for expanded languages", () => {
  const tempDir = join(process.cwd(), "tests", "fixtures", "temp-perf-lang");

  beforeAll(() => {
    mkdirSync(tempDir, { recursive: true });

    // Java unclosed stream
    writeFileSync(
      join(tempDir, "App.java"),
      `public class App {
    public void read() {
        FileReader fr = new FileReader("test.txt");
        // No fr.close() here
    }
}
`
    );

    // Python mutable default argument
    writeFileSync(
      join(tempDir, "script.py"),
      `def process_data(items=[]):
    items.append(1)
    return items
`
    );

    // Go unbuffered channel
    writeFileSync(
      join(tempDir, "main.go"),
      `package main
func main() {
    ch := make(chan int)
    go func() {
        ch <- 1
    }()
}
`
    );

    // PHP file (to verify scan performs correctly on PHP)
    writeFileSync(
      join(tempDir, "index.php"),
      `<?php
for ($i = 0; $i < 10; $i++) {
    for ($j = 0; $j < 10; $j++) {
        // nested loops
    }
}
`
    );
  });

  afterAll(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  describe("scanMemory", () => {
    it("detects Java, Python, and Go memory issues", async () => {
      const findings = await scanMemory(tempDir);
      const titles = findings.map(f => f.title);
      expect(titles).toContain("Unclosed Stream or Reader");
      expect(titles).toContain("Mutable Default Argument");
      expect(titles).toContain("Unbuffered Channel or Goroutine Leak Risk");
    });
  });

  describe("other reviewers", () => {
    it("scan expanded languages without error", async () => {
      const algs = await scanAlgorithms(tempDir);
      const cache = await scanCaching(tempDir);
      const queries = await scanQueries(tempDir);
      const res = await scanResources(tempDir);

      expect(Array.isArray(algs)).toBe(true);
      expect(Array.isArray(cache)).toBe(true);
      expect(Array.isArray(queries)).toBe(true);
      expect(Array.isArray(res)).toBe(true);
    });
  });
});
