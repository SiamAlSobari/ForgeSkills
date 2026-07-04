# Design Patterns Prompt

Analyze code for design pattern usage and anti-patterns.

## Good Patterns to Identify

### Repository Pattern

```javascript
// Good: data access separated
class UserRepository {
  async findById(id) { ... }
  async save(user) { ... }
}
```

### Service Layer

```javascript
// Good: business logic separated
class UserService {
  constructor(userRepo) { this.userRepo = userRepo; }
  async createUser(data) { ... }
}
```

### Factory Pattern

```javascript
// Good: object creation encapsulated
class UserFactory {
  static create(data) { return new User(data); }
}
```

## Anti-Patterns to Flag

### God Class

```javascript
// Bad: class does everything
class UserManager {
  createUser() { ... }
  sendEmail() { ... }
  generateReport() { ... }
  validateInput() { ... }
  logActivity() { ... }
  // 500+ lines...
}
```

### Spaghetti Code

```javascript
// Bad: no structure
function process(data) {
  if (data.type === 'a') {
    // 50 lines of logic
    if (data.subtype === 'x') {
      // 30 more lines
    }
  } else if (data.type === 'b') {
    // 60 lines of logic
  }
}
```

### Magic Numbers

```javascript
// Bad: unexplained values
if (status === 3) { ... }
if (role > 5) { ... }
const timeout = 86400000;

// Good: named constants
const STATUS_ACTIVE = 3;
const ADMIN_ROLE = 5;
const ONE_DAY_MS = 86400000;
```

## Detection Strategy

1. Scan for large classes (>200 lines)
2. Check for deep nesting (>3 levels)
3. Identify long methods (>50 lines)
4. Find magic numbers/strings

## Output

For each finding:
```
Finding: [Pattern/Anti-pattern]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Impact: [maintainability impact]
Recommendation: [refactoring approach]
```
