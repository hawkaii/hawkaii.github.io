# Building the Monkey Parser in Go

## Introduction

The parser is the heart of any interpreter or compiler. In the Monkey interpreter, the parser transforms a stream of tokens (from the lexer) into an Abstract Syntax Tree (AST), which represents the structure and meaning of the source code. This chapter documents the journey of building the parser for Monkey in Go, following Thorsten Ball’s "Writing An Interpreter In Go" and expanding with practical insights, code examples, and lessons learned.

## The Role of the Parser

- **Input:** Sequence of tokens from the lexer
- **Output:** Abstract Syntax Tree (AST)
- **Purpose:** Understands the grammar of Monkey and builds a tree structure that the evaluator can process

## Key Milestones in Parser Development

### 1. Parsing Let and Return Statements

- Implemented parsing for variable declarations (`let x = 5;`) and return statements (`return x;`).
- Used recursive descent parsing to match statement patterns.

### 2. Expression Parsing (Prefix, Infix, Grouping)

- Built Pratt parser for handling expressions like `-a * b`, `a + b`, and grouped expressions `(a + b) * c`.
- Managed operator precedence and associativity.

### 3. If Statements and Blocks

- Added support for conditional logic: `if (x < y) { ... } else { ... }`
- Parsed block statements and conditional branches.

### 4. Functions and Function Calls

- Supported function literals: `fn(x, y) { x + y; }`
- Parsed function calls: `add(2, 3)`

### 5. Error Handling and Recovery

- Implemented error reporting for unexpected tokens and invalid syntax.
- Designed parser to recover from errors and continue parsing subsequent statements.

## Practical Example: Parsing a Monkey Program

Given Monkey code:

```monkey
let x = 5;
let y = 10;
let add = fn(a, b) { a + b; };
let result = add(x, y);
```

The parser produces an AST like:

```
Program
├── LetStatement (x = 5)
├── LetStatement (y = 10)
├── LetStatement (add = fn(a, b) { a + b })
├── LetStatement (result = add(x, y))
```

## Code Walkthrough: Parsing Let Statements

```go
func (p *Parser) parseLetStatement() *ast.LetStatement {
  stmt := &ast.LetStatement{Token: p.curToken}

  if !p.expectPeek(token.IDENT) {
    return nil
  }

  stmt.Name = &ast.Identifier{Token: p.curToken, Value: p.curToken.Literal}

  if !p.expectPeek(token.ASSIGN) {
    return nil
  }

  p.nextToken()
  stmt.Value = p.parseExpression(LOWEST)

  if p.peekTokenIs(token.SEMICOLON) {
    p.nextToken()
  }

  return stmt
}
```

## Lessons Learned & Tips

- **Pratt Parsing:** Powerful for handling complex expressions with precedence.
- **Error Recovery:** Essential for robust parsing and helpful error messages.
- **Testing:** Write parser tests for every new grammar feature.
- **Extensibility:** Design parser to easily add new statements and expressions.

## Extending the Parser

To add new features (e.g., arrays, hash literals), define new AST nodes and update the parser to recognize new syntax patterns.

## References

- [hawkaii/monkey_go GitHub Repository](https://github.com/hawkaii/monkey_go)
- Thorsten Ball, "Writing An Interpreter In Go"

---

_Return to the main [[posts/making_monkey_go|making_monkey_go]] for more chapters._
