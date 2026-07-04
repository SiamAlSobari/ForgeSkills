# Contributing Guide

## How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/ForgeSkill.git

# Install dependencies
bun install

# Run tests
bun test
```

## Adding a New Skill

### 1. Create Directory Structure

```
skills/my-new-skill/
├── SKILL.md
├── prompts/
│   └── topic.md
└── reviewer/
    ├── checker.ts
    └── index.ts
```

### 2. Write SKILL.md

Define the command, workflow, and output format:

```markdown
# /my-new-skill

Description of what this skill does.

## Command

\```
/my-new-skill [path] [--quick|--deep] [--markdown|--json]
\```

## Workflow

1. Understand project
2. Run analysis
3. Generate report
```

### 3. Write Prompts

Create markdown files in `prompts/` that teach AI agents what to look for.

### 4. Implement Reviewers

Create TypeScript files in `reviewer/` that scan code and return `Finding[]`:

```typescript
import { createFinding, type Finding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export async function scanMyPattern(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Scan code here
  // Return findings

  return findings;
}
```

### 5. Export from index.ts

```typescript
export { scanMyPattern } from "./checker";
```

## Writing Tests

### Unit Tests

Test individual functions:

```typescript
import { describe, it, expect } from "vitest";
import { scanMyPattern } from "../reviewer/checker";

describe("scanMyPattern", () => {
  it("returns findings array", async () => {
    const findings = await scanMyPattern(process.cwd());
    expect(Array.isArray(findings)).toBe(true);
  });
});
```

### Integration Tests

Test complete workflows in `tests/integration/`.

### E2E Tests

Test against real projects in `tests/e2e/`.

## Code Style

- TypeScript strict mode
- No comments unless necessary
- Prefer named exports
- Use shared components from `shared/`

## Pull Request Checklist

- [ ] Tests pass (`bun test`)
- [ ] Type check passes (`bun run typecheck`)
- [ ] New skill has SKILL.md
- [ ] New skill has prompts
- [ ] New skill has reviewers
- [ ] Documentation updated if needed
