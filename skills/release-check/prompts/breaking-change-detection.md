# Breaking Change Detection Prompt

Detect breaking changes in code.

## API Breaking Changes

### Removed Endpoints

```javascript
// Before
app.get('/api/users', getUsers);
app.get('/api/users/:id', getUser);

// After: /api/users/:id removed
app.get('/api/users', getUsers);
// Breaking: clients using /api/users/:id will fail
```

### Changed Response Format

```javascript
// Before
{ "name": "John", "email": "john@example.com" }

// After
{ "fullName": "John", "emailAddress": "john@example.com" }
// Breaking: clients expecting old keys will fail
```

### Changed Parameters

```javascript
// Before
function createUser(name, email) { ... }

// After
function createUser({ name, email, role }) { ... }
// Breaking: callers using positional args will fail
```

## Database Breaking Changes

### Column Deletion

```sql
ALTER TABLE users DROP COLUMN phone;
-- Breaking: queries referencing phone will fail
```

### Type Change

```sql
ALTER TABLE users ALTER COLUMN age TYPE TEXT;
-- Breaking: queries using age as number will fail
```

## Configuration Breaking Changes

### Required Fields

```yaml
# Before: optional
database:
  host: localhost

# After: required
database:
  host: localhost
  port: 5432  # Now required
# Breaking: configs without port will fail
```

## Output

For each finding:
```
Finding: [Breaking Change]
Severity: [Critical|High]
Confidence: [High|Medium|Low]
File: [path]
Evidence: [code change]
Impact: [what breaks]
Recommendation: [migration path]
```
