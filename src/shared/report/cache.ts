import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

export interface CacheData {
  hashes: Record<string, string>;
  findings: any[];
}

export function computeFileHashes(projectPath: string, files: string[]): Record<string, string> {
  const hashes: Record<string, string> = {};
  for (const file of files) {
    try {
      const content = readFileSync(join(projectPath, file));
      hashes[file] = createHash("sha256").update(content).digest("hex");
    } catch {
      // Ignore unreadable files
    }
  }
  return hashes;
}

export function saveCache(projectPath: string, hashes: Record<string, string>, findings: any[], scanType?: string): void {
  const cacheFileName = scanType ? `.forge-cache-${scanType.toLowerCase().replace(/\s+/g, "-")}.json` : ".forge-cache.json";
  const cacheFile = join(projectPath, cacheFileName);
  const data: CacheData = { hashes, findings };
  writeFileSync(cacheFile, JSON.stringify(data, null, 2));
}

export function checkCache(projectPath: string, currentHashes: Record<string, string>, scanType?: string): { changed: string[]; cachedFindings: any[] } {
  const cacheFileName = scanType ? `.forge-cache-${scanType.toLowerCase().replace(/\s+/g, "-")}.json` : ".forge-cache.json";
  const cacheFile = join(projectPath, cacheFileName);
  if (!existsSync(cacheFile)) {
    return { changed: Object.keys(currentHashes), cachedFindings: [] };
  }
  try {
    const data: CacheData = JSON.parse(readFileSync(cacheFile, "utf-8"));
    const changed: string[] = [];
    for (const [file, hash] of Object.entries(currentHashes)) {
      if (data.hashes[file] !== hash) {
        changed.push(file);
      }
    }
    const cachedFindings = data.findings.filter(f => !changed.includes(f.location));
    return { changed, cachedFindings };
  } catch {
    return { changed: Object.keys(currentHashes), cachedFindings: [] };
  }
}
