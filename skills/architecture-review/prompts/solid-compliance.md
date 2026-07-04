# SOLID Compliance Prompt

Analyze code for SOLID principles compliance.

## Single Responsibility Principle (SRP)

### Violation

```javascript
// Bad: class has multiple responsibilities
class UserService {
  createUser(data) { ... }
  sendEmail(user) { ... }
  generateReport() { ... }
  logActivity(action) { ... }
}
```

### Compliance

```javascript
// Good: single responsibility
class UserService {
  createUser(data) { ... }
}

class EmailService {
  sendEmail(user) { ... }
}

class ReportService {
  generateReport() { ... }
}
```

## Open/Closed Principle (OCP)

### Violation

```javascript
// Bad: must modify existing code to add new type
function calculateDiscount(user) {
  if (user.type === 'regular') return 0.1;
  if (user.type === 'premium') return 0.2;
  if (user.type === 'vip') return 0.3; // Added later
}
```

### Compliance

```javascript
// Good: extend without modifying
const discountStrategies = {
  regular: () => 0.1,
  premium: () => 0.2,
  vip: () => 0.3,
};

function calculateDiscount(user) {
  return discountStrategies[user.type]();
}
```

## Liskov Substitution Principle (LSP)

### Violation

```javascript
// Bad: subclass breaks parent contract
class Bird {
  fly() { ... }
}

class Penguin extends Bird {
  fly() { throw new Error("Penguins can't fly"); } // Violation!
}
```

## Interface Segregation Principle (ISP)

### Violation

```javascript
// Bad: forced to implement unused methods
class UserService {
  createUser() { ... }
  deleteUser() { ... }
  generateReport() { ... } // Not needed
  exportData() { ... }     // Not needed
}
```

## Dependency Inversion Principle (DIP)

### Violation

```javascript
// Bad: depends on concrete implementation
class OrderService {
  constructor() {
    this.db = new MySQLDatabase(); // Concrete dependency
    this.email = new GmailService(); // Concrete dependency
  }
}
```

### Compliance

```javascript
// Good: depends on abstraction
class OrderService {
  constructor(db, emailService) {
    this.db = db; // Abstract dependency
    this.email = emailService; // Abstract dependency
  }
}
```

## Detection Strategy

1. Check class responsibilities (SRP)
2. Check for modification when extending (OCP)
3. Check subclass contract compliance (LSP)
4. Check interface size (ISP)
5. Check dependency types (DIP)

## Output

For each finding:
```
Finding: SOLID [Principle] Violation
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Impact: [design impact]
Recommendation: [how to comply]
```
