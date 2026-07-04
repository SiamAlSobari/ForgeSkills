# Caching Review Prompt

Analyze code for missing caching opportunities.

## Missing Cache Patterns

### Repeated Expensive Computations

```javascript
// Without cache: recomputes every time
function getExpensiveResult(data) {
  return data.reduce((acc, item) => {
    // Complex calculation
    return acc + item.value * Math.sqrt(item.weight);
  }, 0);
}

// Called multiple times
processA(getExpensiveResult(data));
processB(getExpensiveResult(data)); // Recomputed!
```

### Repeated API Calls

```javascript
// Without cache: fetches every time
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Called from multiple places
const user1 = await getUser(123);
const user2 = await getUser(123); // Fetched again!
```

### Repeated File Reads

```javascript
// Without cache: reads file every time
function getConfig() {
  return JSON.parse(readFileSync('config.json', 'utf-8'));
}

// Called frequently
const config1 = getConfig();
const config2 = getConfig(); // Read again!
```

## Cache Strategies

### In-Memory Cache

```javascript
const cache = new Map();

function getCached(key, computeFn) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const value = computeFn();
  cache.set(key, value);
  return value;
}
```

### Memoization

```javascript
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
```

### TTL Cache

```javascript
class TTLCache {
  constructor(ttl) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.time > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }
}
```

## Detection Strategy

1. Identify expensive computations (loops, API calls, file reads)
2. Check if results are cached
3. Find repeated identical operations
4. Check for cache invalidation

## Output

For each finding:
```
Finding: [Missing Cache]
Severity: [Medium|Low]
Confidence: [Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Impact: [performance impact]
Recommendation: [caching strategy]
```
