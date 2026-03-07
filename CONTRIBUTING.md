# Contributing to Fluidwind

Thank you for taking the time to contribute. This document covers everything you need to get started.

---

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Code Style](#code-style)

---

## Development Setup

**Prerequisites:** Node.js >= 18, npm >= 9

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/koyev/fluidwind.git
cd fluidwind

# 2. Install dependencies
npm install

# 3. Verify everything works
npm test
```

---

## Project Structure

```plaintext
src/
  types.ts              # All shared TypeScript interfaces
  math.ts               # toPx(), toRemString(), buildClamp()
  parser/
    parseColor.ts       # Hex color string → ParsedFluidColor
    parseValue.ts       # Arbitrary value string → ParsedValue | null
  color/
    interpolate.ts      # buildColorClamp() → color-mix() string
  range/
    resolve.ts          # Modifier/config/fallback → ResolvedRange
  utilities/
    registry.ts         # fw-{name} → CSS property mapping
  plugin.ts             # matchUtilities wiring (entry point)
  index.ts              # Public package entry

tests/
  math.test.ts
  parser.test.ts
  color.test.ts
  range.test.ts
  registry.test.ts
  integration.test.ts   # Full PostCSS pipeline tests
```

---

## Running Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
npm run typecheck     # TypeScript type checking only
npm run build         # Compile to dist/
```

All tests must pass and `typecheck` must be clean before opening a PR.

---

## Submitting Changes

1. Create a branch from `main`:

   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes. Add or update tests for any modified behaviour.

3. Ensure everything passes:

   ```bash
   npm run typecheck && npm test
   ```

4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):

   ```plaintext
   feat: add fw-inset-* utilities
   fix: handle unitless values in resolveRange
   docs: update README examples
   chore: bump vitest to v2
   ```

5. Push and open a pull request against `main`. Fill in the PR template.

---

## Reporting Bugs

Open an issue at [github.com/koyev/fluidwind/issues](https://github.com/koyev/fluidwind/issues) and include:

- Fluidwind version
- Tailwind CSS version
- The class(es) that triggered the problem
- Expected CSS output vs. actual output
- A minimal reproduction (CodeSandbox or snippet)

---

## Requesting Features

Open an issue with the `enhancement` label. Describe:

- The use case (what are you trying to achieve?)
- The proposed syntax or API
- Any alternatives you have considered

---

## Code Style

- TypeScript strict mode - no `any`, no `@ts-ignore`
- No external runtime dependencies - keep the package lean
- Pure functions where possible; avoid side effects in modules
- Each module has a single responsibility (see project structure)
- Tests live in `tests/` and mirror the source module structure
