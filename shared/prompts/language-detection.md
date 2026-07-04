# Language Detection Prompt

You are identifying the programming languages used in a project.

## Steps

### 1. Scan File Extensions

Map extensions to languages:

| Extension | Language |
|-----------|----------|
| `.ts`, `.tsx` | TypeScript |
| `.js`, `.jsx`, `.mjs`, `.cjs` | JavaScript |
| `.py` | Python |
| `.go` | Go |
| `.rs` | Rust |
| `.java` | Java |
| `.kt`, `.kts` | Kotlin |
| `.cs` | C# |
| `.cpp`, `.cc`, `.cxx`, `.c`, `.h`, `.hpp` | C/C++ |
| `.rb` | Ruby |
| `.php` | PHP |
| `.swift` | Swift |
| `.dart` | Dart |
| `.scala` | Scala |
| `.ex`, `.exs` | Elixir |
| `.lua` | Lua |
| `.sh`, `.bash`, `.zsh` | Shell |
| `.sql` | SQL |
| `.html`, `.htm` | HTML |
| `.css`, `.scss`, `.sass`, `.less` | CSS |
| `.vue` | Vue |
| `.svelte` | Svelte |

### 2. Calculate Distribution

```
For each language:
  percentage = (files_of_language / total_files) * 100
```

### 3. Classify Languages

- **Primary**: Highest percentage language
- **Secondary**: All others with >5% representation

### 4. Output Format

```
Primary: TypeScript (85%)
Secondary: JavaScript (10%), CSS (5%)
Total Files: 245
```

## Notes

- Exclude `node_modules/`, `dist/`, `out/`, `.git/`
- Count unique files, not lines of code
- Config files (JSON, YAML) don't count as primary language
