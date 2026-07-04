# Architecture Overview

## System Design

SkillForge is designed as a modular ecosystem where:

1. **Shared Components** provide common functionality
2. **Skills** implement domain-specific logic
3. **CLI** orchestrates everything

## Data Flow

```
User Command
    │
    ▼
CLI (index.ts)
    │
    ▼
Runner (runner.ts)
    │
    ├─→ Analyzer (shared/analyzer/)
    │       │
    │       ├─→ Repository detection
    │       ├─→ Language detection
    │       ├─→ Framework detection
    │       └─→ Structure analysis
    │
    ├─→ Reviewers (skills/*/reviewer/)
    │       │
    │       ├─→ Pattern matching
    │       ├─→ Issue detection
    │       └─→ Finding generation
    │
    └─→ Report (shared/report/)
            │
            ├─→ Score calculation
            ├─→ Severity classification
            └─→ Output generation
```

## Shared Components

### Analyzer (`shared/analyzer/`)

Responsible for understanding the project:

- **repository.ts** — Detect git, local, or workspace repos
- **language.ts** — Map file extensions to languages
- **framework.ts** — Detect frameworks from config/deps
- **structure.ts** — Identify monorepo, polyrepo, or single project
- **config.ts** — Find and parse configuration files

### Findings (`shared/findings/`)

Standardized issue representation:

- **types.ts** — Finding, Severity, Confidence, Evidence interfaces
- **classifier.ts** — Auto-classify severity based on issue type
- **prioritizer.ts** — Sort, group, and deduplicate findings

### Report (`shared/report/`)

Generate professional reports:

- **score.ts** — Calculate 0-100 score with severity weighting
- **markdown.ts** — Generate markdown reports
- **json.ts** — Generate JSON reports

## Skills Architecture

Each skill follows the same pattern:

```
skills/<skill-name>/
├── SKILL.md           # Command definition and workflow
├── prompts/           # AI agent instructions
│   └── <topic>.md
└── reviewer/          # TypeScript review engine
    ├── <checker>.ts
    └── index.ts
```

### SKILL.md

Defines:
- Command syntax
- Workflow steps
- Output format

### Prompts

Markdown files that teach AI agents:
- What patterns to look for
- How to classify issues
- How to generate recommendations

### Reviewers

TypeScript modules that:
- Scan source code
- Detect patterns
- Generate Finding objects

## Severity Levels

| Level | Description | Score Impact |
|-------|-------------|--------------|
| Critical | Immediate security risk | -25 |
| High | Significant vulnerability | -15 |
| Medium | Security weakness | -8 |
| Low | Minor issue | -3 |
| Info | Informational | 0 |

## Confidence Levels

| Level | Description |
|-------|-------------|
| High | Pattern match with clear evidence |
| Medium | Likely issue, needs verification |
| Low | Possible issue, context-dependent |
