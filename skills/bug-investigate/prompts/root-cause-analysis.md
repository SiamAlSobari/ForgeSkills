# Root Cause Analysis Prompt

Identify and rank potential root causes for bugs.

## Analysis Framework

### 1. Symptom Identification

Common symptoms:
- Application crashes
- Incorrect output
- Performance degradation
- Unexpected behavior
- Data corruption

### 2. Cause Categories

**Logic Errors:**
- Wrong operator (== vs ===, && vs ||)
- Off-by-one errors
- Incorrect conditions
- Missing edge cases

**Type Errors:**
- Implicit coercion
- Wrong type assumption
- Missing type conversion

**State Errors:**
- Stale state
- Race conditions
- Shared mutable state
- Initialization order

**Resource Errors:**
- Memory leaks
- File handle leaks
- Connection pool exhaustion
- Missing cleanup

### 3. Evidence Collection

For each hypothesis:
- Code location (file, line)
- Triggering conditions
- Frequency (always, sometimes, rare)
- Impact (crash, data loss, UI glitch)

## Ranking Criteria

| Likelihood | Description |
|------------|-------------|
| High | Code clearly has the bug pattern |
| Medium | Possible under certain conditions |
| Low | Unlikely but worth checking |

## Output

```
Root Cause: [description]
Likelihood: [High|Medium|Low]
Evidence:
  - [file:line] [code snippet]
  - [triggering condition]
Impact: [what happens]
Fix: [how to resolve]
```
