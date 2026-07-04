# License Compatibility Prompt

Check dependency licenses for compatibility issues.

## License Categories

### Permissive (Safe)
- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC

### Weak Copyleft (Caution)
- LGPL-2.1
- LGPL-3.0
- MPL-2.0

### Strong Copyleft (Warning)
- GPL-2.0
- GPL-3.0
- AGPL-3.0

### Incompatible (Danger)
- CC-BY-NC (Non-commercial)
- Custom/EULA

## Compatibility Matrix

| Your License | Can Use MIT | Can Use GPL |
|--------------|-------------|-------------|
| MIT | Yes | No (derivative must be GPL) |
| Apache-2.0 | Yes | No |
| GPL-3.0 | Yes | Yes |
| Proprietary | Yes | No |

## Detection Strategy

1. Check package.json license field
2. Look for LICENSE files in node_modules
3. Flag GPL in commercial projects

## Output

For each finding:
```
Finding: [License Issue]
Severity: [High|Medium|Low]
Package: [name]
License: [license type]
Impact: [compatibility issue]
Recommendation: [how to resolve]
```
