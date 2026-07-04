# Skill Customization

## Overview

Each skill can be customized by modifying its prompts and reviewers.

## Customizing Prompts

Prompts are markdown files in `skills/<skill>/prompts/`. They teach AI agents what patterns to look for.

### Adding New Patterns

1. Open the relevant prompt file
2. Add a new pattern section:

```markdown
### My Custom Pattern

\```javascript
// Bad pattern to detect
const badCode = 'example';

// Good pattern
const goodCode = 'better example';
\```

## Detection Strategy

1. Check for bad pattern
2. Verify context
3. Report finding
```

### Adjusting Severity

Edit the reviewer TypeScript file to change severity:

```typescript
// In skills/<skill>/reviewer/<checker>.ts

const MY_PATTERN = {
  name: "Custom Issue",
  severity: Severity.High,  // Change this
  // ...
};
```

## Customizing Reviewers

Reviewers are TypeScript files in `skills/<skill>/reviewer/`.

### Adding New Checks

1. Create a new file or add to existing checker
2. Use `createFinding` to generate findings:

```typescript
import { createFinding, Severity, Confidence, EvidenceType } from "../../../shared/findings";

export function myCustomCheck(content: string, file: string): Finding[] {
  const findings = [];

  // Your detection logic
  if (content.includes("bad pattern")) {
    findings.push(createFinding({
      title: "Custom Issue Found",
      description: "Description of the issue",
      severity: Severity.Medium,
      confidence: Confidence.High,
      category: "Custom",
      evidence: [{
        type: EvidenceType.CodePattern,
        file,
        description: "Found bad pattern"
      }],
      recommendation: "How to fix it"
    }));
  }

  return findings;
}
```

### Modifying Severity Weights

Edit `shared/report/score.ts`:

```typescript
const SEVERITY_WEIGHTS = {
  [Severity.Critical]: 25,  // Adjust these values
  [Severity.High]: 15,
  [Severity.Medium]: 8,
  [Severity.Low]: 3,
  [Severity.Info]: 0,
};
```

## Creating a New Skill

See `docs/contributing.md` for complete instructions.

## Disabling Skills

To disable a skill, simply don't use it. Skills are lazy-loaded and only run when invoked.
