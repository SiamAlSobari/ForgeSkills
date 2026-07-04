# Query Performance Prompt

Analyze database queries for performance issues.

## Slow Query Patterns

### Missing WHERE Clause

```sql
-- Bad: scans entire table
SELECT * FROM orders;

-- Better: filter results
SELECT * FROM orders WHERE user_id = 123;
```

### Full Table Scan

```sql
-- Bad: no index on email
SELECT * FROM users WHERE email = 'test@example.com';

-- Better: add index
CREATE INDEX idx_users_email ON users(email);
```

### SELECT *

```sql
-- Bad: fetches all columns
SELECT * FROM products WHERE category = 'electronics';

-- Better: select needed columns
SELECT id, name, price FROM products WHERE category = 'electronics';
```

### Subquery in Loop

```sql
-- Bad: N+1 pattern
SELECT * FROM users;
-- Then for each user:
SELECT * FROM orders WHERE user_id = ?;

-- Better: JOIN
SELECT u.*, o.* FROM users u LEFT JOIN orders o ON u.id = o.user_id;
```

## Detection Strategy

1. Scan for SELECT * usage
2. Check for missing WHERE clauses
3. Identify subquery patterns
4. Find missing JOINs

## Output

For each finding:
```
Finding: [Issue Type]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [SQL snippet]
Impact: [performance impact]
Recommendation: [optimization]
```
