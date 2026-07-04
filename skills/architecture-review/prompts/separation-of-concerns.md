# Separation of Concerns Prompt

Analyze code for proper separation of concerns.

## Layer Analysis

### Expected Layers

```
Controller/Handler → Service → Repository → Database
     ↓                ↓           ↓
   HTTP logic    Business     Data access
                 logic
```

### Violations to Flag

```javascript
// Bad: controller has business logic
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  user.password = hashPassword(req.body.password); // Business logic
  await user.save(); // Data access
  await sendEmail(user.email); // Infrastructure
  res.json(user);
});

// Good: controller delegates to service
app.post('/users', async (req, res) => {
  const user = await userService.createUser(req.body);
  res.json(user);
});
```

## Responsibility Distribution

### Single Responsibility Violations

```javascript
// Bad: class has multiple responsibilities
class UserController {
  createUser() { ... }
  validateEmail() { ... }
  hashPassword() { ... }
  sendWelcomeEmail() { ... }
  logActivity() { ... }
}
```

### Tight Coupling

```javascript
// Bad: direct dependency on concrete class
class OrderService {
  constructor() {
    this.emailService = new EmailService(); // Tight coupling
    this.paymentGateway = new StripeGateway(); // Tight coupling
  }
}

// Good: dependency injection
class OrderService {
  constructor(emailService, paymentGateway) {
    this.emailService = emailService;
    this.paymentGateway = paymentGateway;
  }
}
```

## Detection Strategy

1. Check for business logic in controllers
2. Check for data access in services
3. Identify tight coupling
4. Find mixed responsibilities

## Output

For each finding:
```
Finding: [Separation Issue]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Impact: [architectural impact]
Recommendation: [how to separate]
```
