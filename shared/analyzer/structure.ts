export type StructureType = "monorepo" | "polyrepo" | "single" | "workspace" | "multi-module";

export interface ModuleInfo {
  name: string;
  path: string;
  type: "package" | "app" | "service" | "lib" | "module";
}

export interface RepositoryStructure {
  type: StructureType;
  modules: ModuleInfo[];
  root: string;
}

export async function detectStructureType(root: string): Promise<StructureType> {
  const { existsSync, readFileSync } = await import("fs");
  const path = await import("path");

  // Check for monorepo indicators
  const monorepoFiles = ["lerna.json", "nx.json", "turbo.json", "pnpm-workspace.yaml"];
  for (const file of monorepoFiles) {
    if (existsSync(path.join(root, file))) return "monorepo";
  }

  // Check package.json for workspaces
  const pkgPath = path.join(root, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.workspaces) return "monorepo";
    } catch {
      // ignore
    }
  }

  // Check for multi-module indicators
  if (existsSync(path.join(root, "go.work"))) return "multi-module";

  // Check for apps/ + packages/ structure
  const hasApps = existsSync(path.join(root, "apps"));
  const hasPackages = existsSync(path.join(root, "packages"));
  if (hasApps && hasPackages) return "monorepo";

  // Check for services/ structure
  if (existsSync(path.join(root, "services"))) return "polyrepo";

  return "single";
}

export async function identifyModules(root: string): Promise<ModuleInfo[]> {
  const { existsSync, readdirSync, readFileSync } = await import("fs");
  const path = await import("path");

  const modules: ModuleInfo[] = [];

  const scanDir = (dir: string, type: ModuleInfo["type"]) => {
    const fullPath = path.join(root, dir);
    if (!existsSync(fullPath)) return;

    try {
      const entries = readdirSync(fullPath, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;

        const modulePath = path.join(dir, entry.name);
        modules.push({ name: entry.name, path: modulePath, type });
      }
    } catch {
      // ignore permission errors
    }
  };

  scanDir("apps", "app");
  scanDir("packages", "package");
  scanDir("services", "service");
  scanDir("libs", "lib");
  scanDir("lib", "lib");
  scanDir("modules", "module");

  return modules;
}

export async function analyzeStructure(root: string): Promise<RepositoryStructure> {
  const type = await detectStructureType(root);
  const modules = await identifyModules(root);

  return { type, modules, root };
}
