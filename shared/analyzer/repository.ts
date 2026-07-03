export type RepositoryType = "git" | "local" | "workspace";

export interface RepositoryInfo {
  type: RepositoryType;
  root: string;
  keyDirectories: string[];
  fileCount: number;
}

export async function detectRepositoryType(root: string): Promise<RepositoryType> {
  const { existsSync } = await import("fs");
  const path = await import("path");

  if (existsSync(path.join(root, ".git"))) return "git";
  if (existsSync(path.join(root, "package.json"))) return "workspace";
  return "local";
}

export async function scanDirectoryStructure(root: string): Promise<string[]> {
  const fg = (await import("fast-glob")).default;
  const entries = await fg("**/*", {
    cwd: root,
    onlyFiles: false,
    deep: 3,
    ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/out/**"],
  });
  return entries;
}

export async function identifyKeyDirectories(root: string): Promise<string[]> {
  const { existsSync } = await import("fs");
  const path = await import("path");

  const candidates = [
    "src",
    "lib",
    "app",
    "apps",
    "packages",
    "services",
    "libs",
    "modules",
    "components",
    "pages",
    "api",
    "server",
    "client",
    "frontend",
    "backend",
    "mobile",
    "shared",
    "common",
    "utils",
    "helpers",
    "core",
    "config",
    "public",
    "static",
    "assets",
  ];

  return candidates.filter((dir) => existsSync(path.join(root, dir)));
}

export async function analyzeRepository(root: string): Promise<RepositoryInfo> {
  const type = await detectRepositoryType(root);
  const structure = await scanDirectoryStructure(root);
  const keyDirectories = await identifyKeyDirectories(root);

  return {
    type,
    root,
    keyDirectories,
    fileCount: structure.length,
  };
}
