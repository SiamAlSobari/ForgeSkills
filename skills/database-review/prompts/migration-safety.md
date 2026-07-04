# Migration Safety Prompt

Analyze database migrations for safety issues.

## Breaking Changes

### Column Deletion

```sql
-- Dangerous: loses data
ALTER TABLE users DROP COLUMN email;

-- Better: deprecate first
-- 1. Add new column
ALTER TABLE users ADD COLUMN email_new VARCHAR(255);
-- 2. Migrate data
UPDATE users SET email_new = email;
-- 3. Deploy code using new column
-- 4. Drop old column after verification
```

### Column Type Change

```sql
-- Dangerous: may lose precision
ALTER TABLE orders ALTER COLUMN total TYPE INT;

-- Better: create new column
ALTER TABLE orders ADD COLUMN total_int INT;
UPDATE orders SET total_int = total::INT;
```

### NOT NULL Constraint

```sql
-- Dangerous: fails if existing NULLs
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Better: add default first
UPDATE users SET email = '' WHERE email IS NULL;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
```

## Data Loss Risks

### DROP TABLE

```sql
-- Dangerous: permanent data loss
DROP TABLE old_users;

-- Better: rename first
ALTER TABLE old_users RENAME TO old_users_backup;
-- Verify no issues, then drop
```

### TRUNCATE

```sql
-- Dangerous: cannot rollback
TRUNCATE TABLE sessions;

-- Better: delete with condition
DELETE FROM sessions WHERE created_at < NOW() - INTERVAL '30 days';
```

## Rollback Strategy

### Forward-Only Migrations

```sql
-- Bad: no rollback possible
ALTER TABLE users ADD COLUMN status VARCHAR(20);

-- Better: include rollback
-- Up:
ALTER TABLE users ADD COLUMN status VARCHAR(20);
-- Down:
ALTER TABLE users DROP COLUMN status;
```

## Detection Strategy

1. Scan for DROP TABLE/ALTER TABLE
2. Check for column deletions
3. Identify type changes
4. Find missing rollback SQL

## Output

For each finding:
```
Finding: [Migration Risk]
Severity: [Critical|High|Medium]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [SQL statement]
Impact: [data loss/downtime risk]
Recommendation: [safer migration approach]
```
