import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface CacheData {
  hashes: Record<string, string>;
  findings: any[];
}

export function saveCache(projectPath: string, hashes: Record<string, string>, findings: any[]): void {
  const cacheFile = join(projectPath, ".forge-cache.json");
  const data: CacheData = { hashes, findings };
  writeFileSync(cacheFile, JSON.stringify(data, null, 2));
}

export function checkCache(projectPath: string, currentHashes: Record<string, string>): { changed: string[]; cachedFindings: any[] } {
  const cacheFile = join(projectPath, ".forge-cache.json");
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
