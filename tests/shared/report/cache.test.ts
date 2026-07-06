import { describe, it, expect } from "vitest";
import { writeFileSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { checkCache, saveCache, computeFileHashes } from "../../../src/shared/report/cache";

describe("Cache System", () => {
  it("should calculate file hashes correctly", () => {
    const tempFile = "temp-hash-test.txt";
    writeFileSync(tempFile, "hello world");
    const hashes = computeFileHashes(".", [tempFile]);
    expect(hashes[tempFile]).toBeDefined();
    expect(hashes[tempFile]).toHaveLength(64);
    rmSync(tempFile);
  });

  it("should detect unchanged files and return cached findings, but clear findings of changed files", () => {
    const tempFile1 = "temp-test-file-1.txt";
    const tempFile2 = "temp-test-file-2.txt";
    writeFileSync(tempFile1, "hello");
    writeFileSync(tempFile2, "world");

    const mockFindings = [
      { id: "f1", title: "Mock Issue 1", severity: "High", evidence: [{ file: tempFile1 }] } as any,
      { id: "f2", title: "Mock Issue 2", severity: "Low", evidence: [{ file: tempFile2 }] } as any
    ];
    saveCache(".", { [tempFile1]: "hash1", [tempFile2]: "hash2" }, mockFindings);

    // Scenario A: Nothing changed
    const resA = checkCache(".", { [tempFile1]: "hash1", [tempFile2]: "hash2" });
    expect(resA.changed).toEqual([]);
    expect(resA.cachedFindings.length).toBe(2);

    // Scenario B: tempFile1 changed
    const resB = checkCache(".", { [tempFile1]: "newhash", [tempFile2]: "hash2" });
    expect(resB.changed).toEqual([tempFile1]);
    expect(resB.cachedFindings.length).toBe(1);
    expect(resB.cachedFindings[0].id).toBe("f2");

    rmSync(tempFile1);
    rmSync(tempFile2);
    rmSync(".forge-cache.json");
  });
});

