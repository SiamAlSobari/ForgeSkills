# Code Path Tracing Prompt

Trace function calls and data flow to identify potential bugs.

## Tracing Strategy

### 1. Entry Points

Identify where code execution begins:
- HTTP handlers (Express routes, Next.js API)
- Event handlers (onClick, onSubmit)
- Lifecycle hooks (componentDidMount, useEffect)
- Main functions (main(), init())

### 2. Call Chain Analysis

```
entry → handler → service → repository → database
  ↓
  error can occur at any point
```

### 3. Data Flow

Track how data moves:
- User input → validation → processing → storage
- API response → parsing → state → UI
- Config → initialization → runtime

## Patterns to Flag

### Missing Null Checks

```javascript
// User input without validation
const name = req.body.name.toUpperCase(); // Crash if name is null

// API response without check
const user = await getUser(id);
console.log(user.email); // Crash if user is null
```

### Unsafe Property Access

```javascript
// Deep property access without optional chaining
const city = user.address.city; // Crash if address is undefined

// Array access without bounds check
const first = arr[0].value; // Crash if arr is empty
```

### Async Error Handling

```javascript
// Missing await
async function getData() {
  const data = fetch('/api'); // Missing await!
  return data.json(); // Fails
}

// Unhandled promise rejection
fetchData()
  .then(process)
  .then(save); // No .catch()
```

## Output

For each finding:
```
Finding: [Issue Type]
Severity: [Critical|High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Data Flow: [input → processing → crash point]
Recommendation: [fix]
```
