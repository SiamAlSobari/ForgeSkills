# Error Log Analysis Prompt

Analyze error patterns and exception handling in source code.

## Error Patterns to Detect

### Uncaught Exceptions

```javascript
// Missing try-catch
const data = JSON.parse(userInput); // Can throw
const value = obj.property.nested; // Can throw

// Unhandled promise rejection
fetchData().then(result => {...}); // No .catch()
async function doWork() {
  await riskyOperation(); // No try-catch
}
```

### Common Error Types

| Error | Cause | Risk |
|-------|-------|------|
| TypeError | Null/undefined access | High |
| ReferenceError | Undeclared variable | High |
| RangeError | Invalid array/string length | Medium |
| SyntaxError | Invalid JSON/regex | Medium |
| Error | Generic throw | Varies |

### Stack Trace Analysis

Look for:
- Error origin (file, line, function)
- Call chain leading to error
- Async boundaries (promises, callbacks)

## Detection Strategy

1. Scan for `throw` statements
2. Scan for `try/catch` blocks
3. Check for missing error handling
4. Identify error propagation paths

## Output

For each finding:
```
Finding: [Issue Type]
Severity: [Critical|High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Root Cause: [explanation]
Recommendation: [fix]
```
