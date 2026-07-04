# Schema Design Prompt

Analyze database schema for design issues.

## Normalization Issues

### Missing Normalization

```sql
-- Bad: repeated data
CREATE TABLE orders (
  id INT,
  user_name VARCHAR(100),
  user_email VARCHAR(100),
  -- user data repeated for each order
);

-- Better: normalize
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE orders (
  id INT,
  user_id INT REFERENCES users(id),
  -- reference user by ID
);
```

### Over-Normalization

```sql
-- Bad: too many joins needed
CREATE TABLE user_first_names (user_id INT, name VARCHAR);
CREATE TABLE user_last_names (user_id INT, name VARCHAR);
CREATE TABLE user_emails (user_id INT, email VARCHAR);

-- Better: combine related data
CREATE TABLE users (
  id INT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100)
);
```

## Data Type Issues

### Wrong Data Types

```sql
-- Bad: storing dates as strings
CREATE TABLE events (
  event_date VARCHAR(10) -- '2024-01-15'
);

-- Better: use proper date type
CREATE TABLE events (
  event_date DATE
);
```

### Inefficient Types

```sql
-- Bad: using TEXT for short strings
CREATE TABLE users (
  status TEXT -- 'active', 'inactive'
);

-- Better: use VARCHAR or ENUM
CREATE TABLE users (
  status VARCHAR(20) CHECK (status IN ('active', 'inactive'))
);
```

## Relationship Issues

### Missing Foreign Keys

```sql
-- Bad: no referential integrity
CREATE TABLE orders (
  id INT,
  user_id INT -- No FK constraint
);

-- Better: add constraint
CREATE TABLE orders (
  id INT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);
```

## Detection Strategy

1. Check for denormalized data
2. Identify wrong data types
3. Find missing foreign keys
4. Detect missing constraints

## Output

For each finding:
```
Finding: [Schema Issue]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Evidence: [DDL statement]
Impact: [data integrity/performance impact]
Recommendation: [schema improvement]
```
