# Query Analysis Prompt

Analyze database queries for performance issues.

## N+1 Query Detection

### Pattern

```javascript
// Fetching list
const users = await User.findAll();

// Then fetching related data for each
for (const user of users) {
  const posts = await Post.findByUserId(user.id); // N+1!
}
```

### Solution

```javascript
// Use eager loading
const users = await User.findAll({ include: ['posts'] });

// Or batch query
const userIds = users.map(u => u.id);
const posts = await Post.findAll({ where: { userId: userIds } });
```

## Slow Query Patterns

### Missing Index

```sql
-- No index on email
SELECT * FROM users WHERE email = 'test@example.com';
```

### SELECT *

```sql
-- Fetching all columns
SELECT * FROM users WHERE active = true;

-- Better: select only needed columns
SELECT id, name, email FROM users WHERE active = true;
```

### Missing LIMIT

```sql
-- Fetching all records
SELECT * FROM orders ORDER BY created_at DESC;

-- Better: limit results
SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;
```

## Detection Strategy

1. Scan for ORM query patterns
2. Check for loops containing queries
3. Identify missing eager loading
4. Find SELECT * usage
5. Check for missing pagination

## Output

For each finding:
```
Finding: [Issue Type]
Severity: [Critical|High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Impact: [performance impact]
Recommendation: [optimization]
```
