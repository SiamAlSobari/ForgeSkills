# Unused Detection Prompt

Detect unused dependencies in project.

## Detection Strategy

### 1. Scan Imports

```javascript
// These are used
import express from 'express';
const lodash = require('lodash');

// package.json might have:
// "moment": "^2.29.4"  ← unused if not imported
```

### 2. Compare with package.json

```
Declared in package.json:
  - express
  - lodash
  - moment
  - axios

Found in imports:
  - express
  - lodash
  - axios

Unused: moment
```

### 3. Check Dev vs Prod Placement

```json
{
  "dependencies": {
    "jest": "^29.0.0"  // Should be in devDependencies
  },
  "devDependencies": {
    "express": "^4.18.0"  // Should be in dependencies
  }
}
```

## Common Misplacements

| Package | Should Be |
|---------|-----------|
| jest, vitest, mocha | devDependencies |
| typescript, eslint | devDependencies |
| webpack, vite, rollup | devDependencies |
| express, fastify | dependencies |
| react, vue | dependencies |

## Output

For each finding:
```
Finding: [Unused/Misplaced Package]
Severity: [Medium|Low]
Package: [name]
Location: [dependencies/devDependencies]
Evidence: [no import found]
Recommendation: [remove or move]
```
