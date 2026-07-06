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
    expect(hashes[tempFile]).toHaveLength(64); // SHA-256 hex length
    rmSync(tempFile);
  });

  it("should detect unchanged files and return cached findings", () => {
    const tempFile = "temp-test-file.txt";
    writeFileSync(tempFile, "hello world");

    const mockFindings = [{ id: "f1", title: "Mock Issue", severity: "High", location: tempFile } as any];
    saveCache(".", { [tempFile]: "hash" }, mockFindings);

    const { changed, cachedFindings } = checkCache(".", { [tempFile]: "hash" });
    expect(changed).toEqual([]);
    expect(cachedFindings.length).toBe(1);

    rmSync(tempFile);
    rmSync(".forge-cache.json");
  });
});
