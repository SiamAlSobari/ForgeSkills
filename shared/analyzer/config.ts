export interface ConfigFile {
  path: string;
  format: "json" | "yaml" | "toml" | "env" | "ini" | "unknown";
  content: Record<string, unknown>;
}

const CONFIG_PATTERNS = [
  "package.json",
  "tsconfig.json",
  "jsconfig.json",
  "vite.config.*",
  "webpack.config.*",
  "rollup.config.*",
  "babel.config.*",
  ".babelrc",
  ".eslintrc.*",
  "eslint.config.*",
  ".prettierrc",
  "prettier.config.*",
  "jest.config.*",
  "vitest.config.*",
  "next.config.*",
  "nuxt.config.*",
  "astro.config.*",
  "svelte.config.*",
  "angular.json",
  "vue.config.*",
  "docker-compose.*",
  "Dockerfile",
  ".env",
  ".env.*",
  "Makefile",
  "Cargo.toml",
  "go.mod",
  "requirements.txt",
  "pyproject.toml",
  "pom.xml",
  "build.gradle",
  "pubspec.yaml",
];

export function detectFormat(filePath: string): ConfigFile["format"] {
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext) return "unknown";

  if (ext === "json" || ext === "jsonc") return "json";
  if (ext === "yaml" || ext === "yml") return "yaml";
  if (ext === "toml") return "toml";
  if (ext === "env" || ext === "local") return "env";
  if (ext === "ini" || ext === "cfg") return "ini";

  // Files without extension
  if (filePath.includes(".env")) return "env";
  if (filePath.includes(".prettierrc") || filePath.includes(".eslintrc")) return "json";

  return "unknown";
}

export async function findConfigFiles(root: string): Promise<string[]> {
  const fg = (await import("fast-glob")).default;
  const files: string[] = [];

  for (const pattern of CONFIG_PATTERNS) {
    const matches = await fg(pattern, {
      cwd: root,
      onlyFiles: true,
      dot: true,
      ignore: ["**/node_modules/**"],
    });
    files.push(...matches);
  }

  return [...new Set(files)];
}

export async function parseConfigFile(
  root: string,
  filePath: string
): Promise<ConfigFile> {
  const { readFileSync } = await import("fs");
  const path = await import("path");

  const fullPath = path.join(root, filePath);
  const format = detectFormat(filePath);

  let content: Record<string, unknown> = {};

  try {
    const raw = readFileSync(fullPath, "utf-8");

    switch (format) {
      case "json":
        content = JSON.parse(raw);
        break;
      case "env":
        content = Object.fromEntries(
          raw
            .split("\n")
            .filter((line) => line.trim() && !line.startsWith("#"))
            .map((line) => {
              const idx = line.indexOf("=");
              if (idx === -1) return [line, ""];
              return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
            })
        );
        break;
      default:
        content = { _raw: raw };
    }
  } catch {
    content = { _error: "Failed to parse" };
  }

  return { path: filePath, format, content };
}

export async function analyzeConfigs(root: string): Promise<ConfigFile[]> {
  const files = await findConfigFiles(root);
  const configs: ConfigFile[] = [];

  for (const file of files) {
    const config = await parseConfigFile(root, file);
    configs.push(config);
  }

  return configs;
}
