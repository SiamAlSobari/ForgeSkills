# Dependency Tree Prompt

Analyze dependency tree for issues.

## Issues to Detect

### Deep Nesting

```
app
  └─ express
       └─ body-parser
            └─ raw-body
                 └─ iconv-lite  // 4 levels deep
```

Risk: Deep trees increase install size and potential vulnerabilities.

### Duplicate Dependencies

```
app
  ├─ package-a
  │    └─ lodash@4.17.21
  └─ package-b
       └─ lodash@4.17.20  // Duplicate!
```

Risk: Increased bundle size, potential version conflicts.

### Lock File Issues

- Missing lock file
- Lock file out of sync with package.json
- Lock file committed with conflicts

## Detection Strategy

1. Check for lock file existence
2. Parse lock file for duplicates
3. Calculate dependency depth
4. Check for known vulnerable versions

## Output

For each finding:
```
Finding: [Tree Issue]
Severity: [High|Medium|Low]
Evidence: [dependency path]
Impact: [size/security impact]
Recommendation: [how to fix]
```
