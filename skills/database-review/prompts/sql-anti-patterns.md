# SQL Anti-patterns Prompt

Detect common SQL anti-patterns.

## Anti-patterns to Detect

### SELECT *

```sql
-- Anti-pattern
SELECT * FROM users WHERE active = true;

-- Better
SELECT id, name, email FROM users WHERE active = true;
```

### N+1 Queries

```javascript
// Anti-pattern: query in loop
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  const orders = await db.query('SELECT * FROM orders WHERE user_id = ?', [user.id]);
}

// Better: single query with JOIN
const results = await db.query(`
  SELECT u.*, o.* FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
`);
```

### Subquery Instead of JOIN

```sql
-- Anti-pattern: correlated subquery
SELECT * FROM users WHERE id IN (
  SELECT user_id FROM orders WHERE total > 100
);

-- Better: JOIN
SELECT DISTINCT u.* FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;
```

### Implicit Cross Join

```sql
-- Anti-pattern: missing join condition
SELECT * FROM users, orders WHERE users.id = 1;

-- Better: explicit join
SELECT * FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.id = 1;
```

### String Concatenation in SQL

```sql
-- Anti-pattern: SQL injection risk
SET @sql = 'SELECT * FROM users WHERE name = ''' + @name + '''';

-- Better: parameterized query
-- Use prepared statements
```

## Detection Strategy

1. Scan for SELECT * in queries
2. Identify subquery patterns
3. Check for implicit joins
4. Find string concatenation in SQL

## Output

For each finding:
```
Finding: [Anti-pattern]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [SQL snippet]
Impact: [performance/security impact]
Recommendation: [improved query]
```
