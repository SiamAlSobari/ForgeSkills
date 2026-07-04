# Troubleshooting

## Common Issues

### "Command not found"

**Problem:** `bun run dev` doesn't work.

**Solution:** Make sure you're in the project root and dependencies are installed:

```bash
cd skillforge
bun install
bun run dev security-audit .
```

### "No findings detected"

**Problem:** Skill runs but reports no issues.

**Solution:** Try `--deep` flag for thorough scan:

```bash
bun run dev security-audit . --deep
```

### TypeScript errors

**Problem:** `bun run typecheck` shows errors.

**Solution:**

1. Make sure you're on latest code: `git pull`
2. Reinstall dependencies: `bun install`
3. Check the error message for specific issues

### Tests failing

**Problem:** `bun test` shows failures.

**Solution:**

1. Run type check first: `bun run typecheck`
2. Fix any type errors
3. Run tests again: `bun test`

### Slow performance

**Problem:** Skills take too long to run.

**Solution:**

1. Use `--quick` flag for fast scan
2. Target specific directories: `bun run dev security-audit ./src`
3. Check for large `node_modules` (excluded by default)

## Error Messages

### "Cannot find module"

Import path issue. Check relative paths in TypeScript files.

### "Type 'X' is not assignable"

Type mismatch. Check shared types in `shared/findings/types.ts`.

### "Property 'X' is missing"

Missing required property in object. Check the interface definition.

## Getting Help

1. Check this documentation
2. Review the PRD (`prd.md`)
3. Look at test files for usage examples
4. Open an issue on GitHub

## Debug Mode

For verbose output, use `--verbose` flag:

```bash
bun run dev security-audit . --verbose
```
