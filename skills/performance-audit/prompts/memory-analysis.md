# Memory Analysis Prompt

Analyze code for memory leak patterns.

## Memory Leak Patterns

### Event Listeners

```javascript
// Leak: listener not removed
element.addEventListener('click', handler);
// Missing: element.removeEventListener('click', handler);

// React: missing cleanup in useEffect
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Missing: return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Timers

```javascript
// Leak: interval not cleared
const interval = setInterval(callback, 1000);
// Missing: clearInterval(interval);

// React: missing cleanup
useEffect(() => {
  const timer = setInterval(update, 1000);
  // Missing: return () => clearInterval(timer);
}, []);
```

### Closures

```javascript
// Leak: closure holds reference to large data
function processData() {
  const largeArray = new Array(1000000).fill('x');
  
  return function() {
    // largeArray is never garbage collected
    console.log(largeArray.length);
  };
}
```

### Global Variables

```javascript
// Leak: global variable grows indefinitely
window.cache = {};

function addToCache(key, value) {
  window.cache[key] = value; // Never cleaned up
}
```

### DOM References

```javascript
// Leak: DOM element stored but not removed
const elements = [];

function addElement(el) {
  elements.push(el); // Never removed
}
```

## Detection Strategy

1. Scan for addEventListener without removeEventListener
2. Check for setInterval/setTimeout without clear
3. Identify closures capturing large objects
4. Find global variable accumulation

## Output

For each finding:
```
Finding: [Leak Type]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Impact: [memory growth over time]
Recommendation: [cleanup strategy]
```
