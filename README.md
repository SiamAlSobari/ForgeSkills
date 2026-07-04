# SkillForge

Global AI Skills Ecosystem for code review and audit.

SkillForge provides AI Coding Agents (OpenCode, Pi Agent) with the ability to perform code reviews like specialist engineers — using a single command.

## Installation

```bash
# Clone the repository
git clone https://github.com/SiamAlSobari/ForgeSkill.git

# Install dependencies
bun install

# Run tests
bun test
```

## Quick Start

```bash
# Security audit
bun run dev security-audit .

# Bug investigation
bun run dev bug-investigate .

# Performance audit
bun run dev performance-audit .

# Architecture review
bun run dev architecture-review .

# Dependency review
bun run dev dependency-review .

# Database review
bun run dev database-review .

# Release check
bun run dev release-check .
```

## Available Skills

| Command | Purpose |
|---------|---------|
| `/security-audit` | Security review of source code |
| `/bug-investigate` | Investigate bugs automatically |
| `/performance-audit` | Audit application performance |
| `/architecture-review` | Review project architecture |
| `/dependency-review` | Review project dependencies |
| `/database-review` | Review database usage |
| `/release-check` | Pre-release checklist |

## Options

Each skill supports the following options:

| Option | Description |
|--------|-------------|
| `[path]` | Target directory (default: `.`) |
| `--quick` | Fast scan, focus on critical issues |
| `--deep` | Thorough scan, check all patterns |
| `--markdown` | Output as markdown (default) |
| `--json` | Output as JSON |
| `--verbose` | Detailed output |

## Output Example

```
Security Audit Report

**Project:** my-app
**Language:** TypeScript
**Framework:** Express
**Date:** 2024-01-15

## Score

**72/100** (Grade: C)

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 2 |
| Medium | 3 |
| Low | 5 |

## Critical Findings

### Hardcoded Secret
**Category:** Security | **Confidence:** High

Found hardcoded API key in source code.

**Evidence:**
- `src/config.ts` (line 5)
  const API_KEY = "sk_live_abc123"

**Recommendation:**
Move to environment variables.
```

## Architecture

```
skillforge/
├── shared/                    # Shared components
│   ├── analyzer/              # Repository analysis
│   ├── findings/              # Findings & severity
│   ├── report/                # Report generator
│   └── prompts/               # Shared prompt templates
├── skills/                    # Individual skills
│   ├── security-audit/
│   ├── bug-investigate/
│   ├── performance-audit/
│   ├── architecture-review/
│   ├── dependency-review/
│   ├── database-review/
│   └── release-check/
├── src/                       # CLI runtime
│   └── cli/
├── tests/
└── docs/
```

## Development

```bash
# Type check
bun run typecheck

# Run tests
bun test

# Watch mode
bun test --watch
```

## License

MIT
