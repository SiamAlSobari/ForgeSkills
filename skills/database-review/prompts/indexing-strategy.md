# Indexing Strategy Prompt

Analyze database indexing for optimization opportunities.

## Missing Index Patterns

### Query Without Index

```sql
-- Query on non-indexed column
SELECT * FROM orders WHERE status = 'pending';
-- Needs: CREATE INDEX idx_orders_status ON orders(status);
```

### Composite Index Opportunity

```sql
-- Query on multiple columns
SELECT * FROM orders WHERE user_id = 123 AND status = 'completed';
-- Needs: CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

### ORDER BY Without Index

```sql
-- Sorting without index
SELECT * FROM products ORDER BY created_at DESC;
-- Needs: CREATE INDEX idx_products_created ON products(created_at DESC);
```

## Unused Index Detection

```sql
-- Index exists but never used in queries
CREATE INDEX idx_users_phone ON users(phone);
-- But no queries filter by phone
```

## Index Anti-Patterns

### Over-Indexing

```sql
-- Too many indexes slow down writes
CREATE INDEX idx1 ON table(col1);
CREATE INDEX idx2 ON table(col2);
CREATE INDEX idx3 ON table(col3);
-- Each INSERT/UPDATE must update all indexes
```

### Wrong Index Order

```sql
-- Composite index with wrong column order
CREATE INDEX idx ON orders(status, user_id);
-- But queries filter by user_id first
```

## Detection Strategy

1. Identify frequently queried columns
2. Check for missing indexes on foreign keys
3. Find composite index opportunities
4. Detect unused indexes

## Output

For each finding:
```
Finding: [Index Issue]
Severity: [High|Medium|Low]
Confidence: [Medium|Low]
File: [path]
Evidence: [query pattern]
Impact: [performance impact]
Recommendation: [index suggestion]
```
