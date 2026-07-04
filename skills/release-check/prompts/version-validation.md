# Version Validation Prompt

Check version consistency and semantic versioning.

## Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes
```

## Checks

### Version Consistency

```json
// package.json
{ "version": "1.2.0" }

// Should match:
// - CHANGELOG.md header
// - Git tags
// - Other version files
```

### Version Bump

- Is version incremented?
- Is increment appropriate for changes?
- Is pre-release tag needed? (alpha, beta, rc)

### Pre-release Versions

```
1.0.0-alpha.1
1.0.0-beta.1
1.0.0-rc.1
```

## Output

For each finding:
```
Finding: [Version Issue]
Severity: [High|Medium|Low]
Evidence: [version info]
Recommendation: [fix]
```
