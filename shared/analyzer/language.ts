export interface LanguageInfo {
  name: string;
  extension: string;
  fileCount: number;
  percentage: number;
}

export interface LanguageDistribution {
  primary: LanguageInfo;
  secondary: LanguageInfo[];
  total: number;
}

const EXTENSION_MAP: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",
  ".py": "Python",
  ".go": "Go",
  ".rs": "Rust",
  ".java": "Java",
  ".kt": "Kotlin",
  ".kts": "Kotlin",
  ".cs": "C#",
  ".cpp": "C++",
  ".cc": "C++",
  ".cxx": "C++",
  ".c": "C",
  ".h": "C/C++",
  ".hpp": "C++",
  ".rb": "Ruby",
  ".php": "PHP",
  ".swift": "Swift",
  ".dart": "Dart",
  ".scala": "Scala",
  ".clj": "Clojure",
  ".ex": "Elixir",
  ".exs": "Elixir",
  ".erl": "Erlang",
  ".hs": "Haskell",
  ".ml": "OCaml",
  ".r": "R",
  ".R": "R",
  ".lua": "Lua",
  ".sh": "Shell",
  ".bash": "Shell",
  ".zsh": "Shell",
  ".ps1": "PowerShell",
  ".sql": "SQL",
  ".html": "HTML",
  ".htm": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",
  ".sass": "Sass",
  ".less": "Less",
  ".vue": "Vue",
  ".svelte": "Svelte",
};

export function mapExtensionToLanguage(ext: string): string | null {
  return EXTENSION_MAP[ext] ?? null;
}

export function calculateLanguageDistribution(
  files: string[]
): LanguageDistribution {
  const counts = new Map<string, { count: number; extensions: Set<string> }>();

  for (const file of files) {
    const lastDot = file.lastIndexOf(".");
    if (lastDot === -1) continue;

    const ext = file.slice(lastDot).toLowerCase();
    const lang = mapExtensionToLanguage(ext);
    if (!lang) continue;

    const entry = counts.get(lang) ?? { count: 0, extensions: new Set() };
    entry.count++;
    entry.extensions.add(ext);
    counts.set(lang, entry);
  }

  const total = files.length;
  const sorted = [...counts.entries()].sort((a, b) => b[1].count - a[1].count);

  if (sorted.length === 0) {
    return {
      primary: { name: "Unknown", extension: "", fileCount: 0, percentage: 0 },
      secondary: [],
      total,
    };
  }

  const [primaryName, primaryData] = sorted[0]!;
  const primary: LanguageInfo = {
    name: primaryName,
    extension: [...primaryData.extensions][0] ?? "",
    fileCount: primaryData.count,
    percentage: Math.round((primaryData.count / total) * 100),
  };

  const secondary: LanguageInfo[] = sorted.slice(1).map(([name, data]) => ({
    name,
    extension: [...data.extensions][0] ?? "",
    fileCount: data.count,
    percentage: Math.round((data.count / total) * 100),
  }));

  return { primary, secondary, total };
}
