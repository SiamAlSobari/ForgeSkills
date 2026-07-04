---
name: security-audit
description: >
  Security review of source code - detect vulnerabilities (SQL injection, XSS, CSRF, SSRF, RCE), secrets, config issues.
  Trigger when user types /security-audit or requests a security audit/review.
---

# /security-audit

Security review of source code using AI reasoning.

## Command

```
/security-audit [path] [--quick|--deep] [--markdown|--json] [--verbose]
```

### Options

- `[path]` — Target directory (default: current directory)
- `--quick` — Fast scan, focus on critical issues only
- `--deep` — Thorough scan, check all patterns
- `--markdown` — Output as markdown (default)
- `--json` — Output as JSON
- `--verbose` — Include detailed evidence

## Purpose

Analyze source code for:
- Security vulnerabilities (SQL Injection, XSS, CSRF, SSRF, RCE)
- Hardcoded secrets (API keys, tokens, passwords)
- Configuration issues (CORS, debug mode, JWT)
- Infrastructure security (Dockerfile, K8s, CI/CD)

## Workflow

### Step 1: Understand Project

Use `shared/analyzer/` to detect:
- Repository type
- Primary language
- Framework
- Project structure

### Step 2: Run Security Analysis

Execute analysis prompts in order:
1. Secrets Detection (`prompts/secrets-detection.md`)
2. Source Code Review (`prompts/source-code-review.md`)
3. Configuration Review (`prompts/config-review.md`)
4. Infrastructure Review (`prompts/infrastructure-review.md`)

### Step 3: Classify Findings

For each finding:
- Assign severity: Critical, High, Medium, Low, Info
- Assign confidence: High, Medium, Low
- Include evidence (file, line, code snippet)

### Step 4: Generate Report

Use `shared/report/` to generate:
- Security Score (0-100)
- Severity-grouped findings
- Recommendations
- Next steps

## Output Format

```
Security Audit Report

Score: [0-100] (Grade: A-F)

Critical Findings: [count]
High Findings: [count]
Medium Findings: [count]
Low Findings: [count]
Info Findings: [count]

[Detailed findings with evidence]

Recommendations:
1. [actionable fix]
2. [actionable fix]

Next Steps:
1. [immediate action]
2. [short-term action]
```

## Integration with Shared Components

```typescript
import { analyzeRepository, detectFrameworks } from "../../shared/analyzer";
import { createFinding, classifyFinding } from "../../shared/findings";
import { calculateScore, generateMarkdownReport } from "../../shared/report";
```

## Confidence Levels

- **High**: Pattern match with clear evidence
- **Medium**: Likely issue, needs verification
- **Low**: Possible issue, context-dependent
