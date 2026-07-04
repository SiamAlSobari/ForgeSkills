# Changelog Verification Prompt

Check changelog exists and is properly formatted.

## Checks

### Changelog Exists

Look for:
- CHANGELOG.md
- CHANGES.md
- HISTORY.md
- RELEASE_NOTES.md

### Format Check

Common formats:

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added
- New feature X

### Changed
- Updated Y

### Fixed
- Bug in Z

### Removed
- Deprecated W
```

### Completeness Check

- Recent changes documented
- Version matches package.json
- Date is reasonable
- No placeholder text

## Output

For each finding:
```
Finding: [Changelog Issue]
Severity: [High|Medium|Low]
File: [path]
Evidence: [content]
Recommendation: [fix]
```
