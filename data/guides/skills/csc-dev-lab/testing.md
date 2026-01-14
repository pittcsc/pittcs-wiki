---
title: "[DevLab] 4. Testing Your Code"
author: "Liam Brem"
date: "2026-01-09"
---

If clean code makes software readable, **tests make software reliable**.

In real-world projects, testing is not something that can be overlooked, it's the mechanism that allows teams to move fast without breaking important things. This article explains why testing matters, the major types of tests, how to write them, and what Dev Lab expects from contributors.

## 1. Why Spend Time Testing Your Code?

Every system changes constantly:

- New features get added
- Bugs are fixed
- Performance is improved
- APIs evolve

Without tests, every change is risky. You have no reliable way to know whether something you touched broke something somewhere else.

Tests give you:

- **Confidence** that changes didn’t introduce bugs
- **Documentation** of how code is supposed to behave
- **Faster development** (you spend less time manually re-testing)
- **Better design** (testable code is usually better-structured code)

---

## 2. What Is TDD (Test-Driven Development)?

**Test-Driven Development (TDD)** is a workflow where you:

1. Write a failing test that works through a desired behavior
2. Write just enough code to make the test pass
3. Refactor the code while keeping the test passing

This cycle repeats continuously.

### Why People Like TDD

- Forces you to think about API and design first
- Produces highly testable code
- Prevents over-engineering
- Gives immediate feedback

### Why Some Engineers Disagree with TDD

- It can slow down early prototyping
- Some systems (UI, graphics, data pipelines) are difficult to test first
- Poorly written tests can become a maintenance burden

In practice, most teams use a **hybrid** approach:

- Critical business logic is heavily tested
- UI and experimental code may be tested after implementation

> In software engineering, _business logic_ typically refers to the rules and logic of the business/project. For example, the business logic of a platform like Uber would encompass the rule that drivers must be within a certain range to accept a ride request. However, the API calls, database operations, and UI code would _not_ be considered business logic.

---

## 3. Types of Tests

Not all tests serve the same purpose.

### Unit Tests

Test a single function or small piece of logic in isolation.

- Fast
- Easy to debug
- Great for business logic

Example:

> Does `calculate_total()` return the correct sum?

---

### Integration Tests

Test how multiple parts of the system work together.

- Slightly slower
- Catch bugs between components
- Validate assumptions about how modules interact

Example:

> Does the API correctly communicate with the database?

---

### End-to-End (E2E) Tests

Test the entire system as a user would.

- Slowest
- Most realistic
- Catch wiring and configuration issues

Example:

> Can a user sign up, log in, and submit a form through the UI?

---

### A Healthy Test Framework

Most projects follow this rough balance:

- **Many** unit tests
- **Some** integration tests
- **Few** E2E tests

This keeps feedback fast while still covering real-world behavior.

---

## 4. Testing Frameworks

Different languages have standard tools.

### JavaScript / TypeScript

- **Jest** – unit and integration tests
- **Vitest** – modern Jest-like runner
- **Playwright / Cypress** – E2E browser testing

### Python

- **pytest** – dominant testing framework
- **unittest** – built-in library
- **Playwright / Selenium** – browser testing

### Other Common Tools

- Java: JUnit
- Go: `testing` package
- C++: GoogleTest

Most Dev Lab projects will specify which framework to use in their documentation.

---

## 5. How to Write a Good Test

A good test is:

- **Small**
- **Focused**
- **Deterministic**
- **Readable**

### The Arrange–Act–Assert Pattern

Most tests follow this structure:

1. **Arrange** – set up inputs and environment
2. **Act** – call the function or feature
3. **Assert** – verify the result

Example (Python):

```python
def test_calculate_total():
    prices = [10, 20, 30] # Arrange

    total = calculate_total(prices) # Act

    assert total == 60 # Assert
```

This makes intent clear and failures easy to diagnose.

---

## 6. What to Test

Focus on:

- Business logic
- Edge cases
- Failure modes
- Public APIs

Avoid:

- Testing implementation details
- Duplicating what the language/runtime already guarantees
- Writing brittle tests tied to formatting or internal structure

Tests should verify **behavior**, not **how the code happens to be written**.

---

## 7. Test Failures Are Signals, Not Hindrances

When a test fails, it is telling you something:

- Either the code is wrong
- Or the test is wrong

Both are valuable pieces of information.

Never ignore failing tests. Fix them or update them BEFORE pushing your code.

---

## 8. Expectations in CSC Dev Lab

In Dev Lab:

- New features should include tests when appropriate
- Bug fixes should include a test that would have caught the bug
- PRs may be blocked if they introduce untested critical logic
- CI checks must pass before merging

This mirrors professional engineering standards.

---

## 9. Common Beginner Mistakes

- Writing tests that rely on random data
- Testing trivial getters and setters
- Writing huge tests that cover many things at once
- Skipping tests because “it works for me”

The goal is not 100% coverage; it's building a reliable product.

---

## 10. Resources to Learn More

### General Testing

- _Testing JavaScript Applications_ (Kent C. Dodds)
- _Python Testing with pytest_ (book and online guides)

### Official Docs

- Jest: [https://jestjs.io](https://jestjs.io)
- pytest: [https://docs.pytest.org](https://docs.pytest.org)
- Playwright: [https://playwright.dev](https://playwright.dev)
- Cypress: [https://www.cypress.io](https://www.cypress.io)

### Testing Philosophies

- [https://martinfowler.com/testing/](https://martinfowler.com/testing/)
- [https://testingjavascript.com](https://testingjavascript.com)
