# Algorithm Analysis Prompt

Analyze code for algorithmic complexity issues.

## O(n²) Patterns

### Nested Loops

```javascript
// O(n²) - comparing all pairs
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    if (items[i].id === items[j].id) {
      // Found duplicate
    }
  }
}

// Better: O(n) with Set
const seen = new Set();
for (const item of items) {
  if (seen.has(item.id)) {
    // Found duplicate
  }
  seen.add(item.id);
}
```

### Array Methods in Loops

```javascript
// O(n²) - indexOf is O(n)
for (const item of items) {
  if (otherArray.indexOf(item.id) !== -1) {
    // Found in other array
  }
}

// Better: O(n) with Set
const otherSet = new Set(otherArray.map(i => i.id));
for (const item of items) {
  if (otherSet.has(item.id)) {
    // Found in other array
  }
}
```

## Inefficient String Operations

### String Concatenation in Loop

```javascript
// O(n²) - strings are immutable
let result = '';
for (const item of items) {
  result += item.text; // Creates new string each time
}

// Better: O(n)
const parts = [];
for (const item of items) {
  parts.push(item.text);
}
const result = parts.join('');
```

## Inefficient Array Operations

### Repeated Array Scans

```javascript
// O(n²) - filter is O(n), called n times
const filtered = items.filter(item => {
  return items.filter(i => i.id === item.id).length > 1;
});

// Better: O(n)
const counts = new Map();
for (const item of items) {
  counts.set(item.id, (counts.get(item.id) || 0) + 1);
}
const filtered = items.filter(item => counts.get(item.id) > 1);
```

## Detection Strategy

1. Scan for nested loops
2. Check for array methods inside loops
3. Identify string concatenation in loops
4. Find repeated array scans

## Output

For each finding:
```
Finding: [Complexity Issue]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Current Complexity: [O(n²)]
Optimal Complexity: [O(n)]
Recommendation: [optimization]
```
