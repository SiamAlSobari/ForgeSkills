# Technical Debt Prompt

Analyze code for technical debt and code smells.

## Code Smells

### Long Methods

```javascript
// Bad: method does too many things
function processOrder(order) {
  // 100+ lines
  validate(order);
  calculateTax(order);
  applyDiscount(order);
  processPayment(order);
  updateInventory(order);
  sendConfirmation(order);
  logActivity(order);
}

// Good: single responsibility
function processOrder(order) {
  validate(order);
  const total = calculateTotal(order);
  await processPayment(total);
  await fulfillOrder(order);
}
```

### Large Files

```
// Bad: file has 1000+ lines
user.controller.ts (1200 lines)

// Good: split by concern
user.controller.ts (100 lines)
user.service.ts (200 lines)
user.validation.ts (100 lines)
```

### Deep Nesting

```javascript
// Bad: 5+ levels of nesting
function process(data) {
  if (data) {
    if (data.type) {
      if (data.type === 'order') {
        if (data.items) {
          if (data.items.length > 0) {
            // Finally do something
          }
        }
      }
    }
  }
}

// Good: early returns
function process(data) {
  if (!data) return;
  if (!data.type) return;
  if (data.type !== 'order') return;
  if (!data.items?.length) return;
  // Do something
}
```

### Duplicated Code

```javascript
// Bad: same logic in multiple places
function validateUser(user) {
  if (!user.email) throw new Error('Email required');
  if (!user.name) throw new Error('Name required');
  // ...
}

function validateAdmin(admin) {
  if (!admin.email) throw new Error('Email required');
  if (!admin.name) throw new Error('Name required');
  // ...
}

// Good: shared validation
function validatePerson(person, requiredFields) {
  for (const field of requiredFields) {
    if (!person[field]) throw new Error(`${field} required`);
  }
}
```

## Deprecated Patterns

```javascript
// Old: callbacks
getData(function(err, data) { ... });

// Modern: promises/async
const data = await getData();

// Old: var
var x = 1;

// Modern: const/let
const x = 1;
```

## Detection Strategy

1. Count lines per function (>50 is warning)
2. Count lines per file (>300 is warning)
3. Check nesting depth (>3 is warning)
4. Find similar code blocks

## Output

For each finding:
```
Finding: [Code Smell]
Severity: [Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Impact: [maintainability impact]
Recommendation: [refactoring approach]
```
