# Modularity Prompt

Analyze code for module boundaries and dependency direction.

## Module Boundaries

### Good Boundaries

```
src/
  modules/
    users/
      user.controller.ts
      user.service.ts
      user.repository.ts
      user.types.ts
    orders/
      order.controller.ts
      order.service.ts
      order.repository.ts
      order.types.ts
```

### Boundary Violations

```javascript
// Bad: order module directly accesses user internals
import { UserModel } from '../users/user.model';

class OrderService {
  async createOrder(userId, data) {
    const user = await UserModel.findById(userId); // Violation!
    // Should use UserService instead
  }
}
```

## Dependency Direction

### Correct: Outer depends on Inner

```
Controller → Service → Repository → Database
```

### Wrong: Inner depends on Outer

```javascript
// Bad: repository depends on controller
class UserRepository {
  findAll() {
    const currentUser = getCurrentHttpRequest(); // Wrong!
  }
}
```

## Circular Dependencies

```javascript
// Bad: A depends on B, B depends on A
// a.ts
import { doSomething } from './b';
export function a() { doSomething(); }

// b.ts
import { a } from './a';
export function doSomething() { a(); }
```

## Detection Strategy

1. Check for cross-module imports
2. Identify circular dependencies
3. Verify dependency direction
4. Check for shared state between modules

## Output

For each finding:
```
Finding: [Modularity Issue]
Severity: [High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [import statement]
Impact: [architectural impact]
Recommendation: [how to fix boundary]
```
