import { describe, it, expect } from "vitest";
import { writeFileSync, rmSync } from "fs";
import { checkCache, saveCache } from "../../../src/shared/report/cache";

describe("Cache System", () => {
  it("should detect unchanged files and return cached findings", () => {
    const tempFile = "temp-test-file.txt";
    writeFileSync(tempFile, "hello world");

    const mockFindings = [{ id: "f1", title: "Mock Issue", severity: "High", location: tempFile }];
    saveCache(".", { [tempFile]: "hash" }, mockFindings);

    const { changed, cachedFindings } = checkCache(".", { [tempFile]: "hash" });
    expect(changed).toEqual([]);
    expect(cachedFindings.length).toBe(1);

    rmSync(tempFile);
    rmSync(".forge-cache.json");
  });
});
