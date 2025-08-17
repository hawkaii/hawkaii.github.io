# AGENTS.md

## Build, Lint, and Test Commands

- Build: `npm run quartz` (CLI) or `npm run docs` (serve docs)
- Lint: `npm run check` (TypeScript + Prettier)
- Format: `npm run format` (Prettier)
- Test: `npm run test` (all tests)
- Run a single test: `tsx --test path/to/test.ts`

## Code Style Guidelines

- Use 2-space indentation, no semicolons, trailing commas, print width 100
- Prefer named imports; group and order consistently
- Use TypeScript strict mode, ESNext modules, Preact JSX
- Use camelCase for variables/functions, PascalCase for types/classes
- Type all props and function parameters explicitly
- Avoid unused variables and parameters
- Handle errors with clear messages; use QuartzLogger for logging
- Escape/unescape HTML with provided utilities
- Components: type props, use generics where needed
- Keep code modular and readable; avoid large functions
- Document complex logic with concise comments

_This file guides agentic coding agents for consistent, robust contributions._
