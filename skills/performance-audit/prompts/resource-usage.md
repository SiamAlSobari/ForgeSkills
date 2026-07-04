# Resource Usage Prompt

Analyze code for resource usage issues.

## CPU-Intensive Operations

### Synchronous Blocking

```javascript
// Blocking: freezes event loop
const data = fs.readFileSync('large-file.txt', 'utf-8');
const result = JSON.parse(data);

// Better: async
const data = await fs.promises.readFile('large-file.txt', 'utf-8');
```

### Heavy Computation

```javascript
// Blocking: CPU-intensive
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Better: memoized or iterative
const memo = new Map();
function fibonacci(n) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  memo.set(n, result);
  return result;
}
```

## I/O Blocking

### Sequential I/O

```javascript
// Slow: sequential
const user = await getUser(id);
const posts = await getPosts(id);
const comments = await getComments(id);

// Better: parallel
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id),
]);
```

## Network Calls

### Missing Batching

```javascript
// Slow: multiple requests
for (const id of userIds) {
  const user = await getUser(id); // One request per user
}

// Better: batch request
const users = await getUsersByIds(userIds);
```

## Bundle Size (Frontend)

### Large Imports

```javascript
// Bad: imports entire library
import _ from 'lodash';
_.get(obj, 'path');

// Better: import only what's needed
import get from 'lodash/get';
get(obj, 'path');
```

### Dynamic Imports

```javascript
// Bad: loads everything upfront
import HeavyComponent from './HeavyComponent';

// Better: lazy load
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

## Detection Strategy

1. Scan for sync file operations
2. Check for sequential async operations
3. Identify heavy computations
4. Find large library imports

## Output

For each finding:
```
Finding: [Resource Issue]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Impact: [performance impact]
Recommendation: [optimization]
```
