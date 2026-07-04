# Edge Case Detection Prompt

Detect boundary conditions and edge cases that can cause bugs.

## Categories

### 1. Null/Undefined Handling

```javascript
// Missing null check
const length = str.length; // Crash if str is null

// Optional chaining missing
const city = user.address?.city; // Should use ?.

// Default values missing
function greet(name) {
  return `Hello, ${name.toUpperCase()}`; // Crash if name undefined
}
```

### 2. Empty Collections

```javascript
// Empty array
const first = arr[0].value; // Crash if arr is empty
const sum = arr.reduce(add); // Error if arr is empty without initial value

// Empty object
const keys = Object.keys(obj);
if (keys.length > 0) {
  const first = keys[0]; // Could be undefined
}

// Empty string
const parts = str.split(','); // [""] if str is empty
```

### 3. Boundary Values

```javascript
// Off-by-one
for (let i = 0; i <= arr.length; i++) { // Should be <
  arr[i]; // Undefined at last iteration
}

// Numeric boundaries
if (count > 0) { ... } // What about count === 0?
if (age >= 18) { ... } // What about age === 18?

// String boundaries
str.charAt(str.length); // Returns ""
str.slice(0, 0); // Returns ""
```

### 4. Race Conditions

```javascript
// Check-then-act
if (!file.exists()) {
  file.create(); // File might be created between check and create
}

// Async ordering
let result;
fetchData().then(data => { result = data; });
console.log(result); // Might be undefined

// Shared state
let counter = 0;
increment(); // Could be called from multiple places
if (counter === 1) { ... } // Might not be 1
```

### 5. Memory Leaks

```javascript
// Event listeners not removed
element.addEventListener('click', handler);
// Missing: element.removeEventListener('click', handler)

// Timers not cleared
setInterval(callback, 1000);
// Missing: clearInterval(timer)

// Closures holding references
function createHandler() {
  const largeData = new Array(1000000);
  return () => { /* uses largeData */ };
  // largeData never garbage collected
}
```

### 6. Exception Handling

```javascript
// Swallowing errors
try {
  riskyOperation();
} catch (e) {
  // Silent failure - bad!
}

// Missing finally
function connect() {
  const conn = createConnection();
  doWork(conn);
  conn.close(); // Not called if doWork throws
}
```

## Output

For each finding:
```
Finding: [Edge Case Type]
Severity: [Critical|High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Trigger: [when this bug occurs]
Impact: [what happens]
Recommendation: [fix]
```
