import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { scanAntiPatterns } from "../../../skills/database-review/reviewer/anti-pattern";

describe("database-review anti-patterns for expanded languages", () => {
  const tempDir = join(process.cwd(), "tests", "fixtures", "temp-db-lang");

  beforeAll(() => {
    mkdirSync(tempDir, { recursive: true });

    // Java N+1 query and SQL Injection Risk
    writeFileSync(
      join(tempDir, "Repository.java"),
      `public class Repository {
    public void getItems(List<String> ids) {
        for (String id : ids) {
            query("SELECT * FROM items WHERE id = " + id);
        }
    }
}
`
    );

    // Python N+1 query and SQL Injection Risk
    writeFileSync(
      join(tempDir, "db.py"),
      `def get_users(ids):
    for id in ids:
        execute("SELECT * FROM users WHERE id = " + id)
`
    );
  });

  afterAll(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  describe("scanAntiPatterns", () => {
    it("detects N+1 queries and SQL injection risk in Java and Python", async () => {
      const findings = await scanAntiPatterns(tempDir);
      const titles = findings.map(f => f.title);
      expect(titles).toContain("N+1 Query Pattern");
      expect(titles).toContain("SQL Injection Risk");
    });
  });
});
