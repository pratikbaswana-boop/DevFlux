# Test Writing Workflow

Use for writing unit tests for a class or method.
**CRITICAL**: Context is gathered FIRST, then code is analyzed based on that context.

**Note**: If unfamiliar with TOON (Token-Oriented Object Notation) format, perform a web search to understand the proper syntax before creating files.

## Guardrails
- **RE-ANCHOR at EVERY step**: State the test requirements/context in one line before doing ANY work.
- **Context-first**: Never analyze code without understanding what needs to be tested first.
- **Pattern adherence**: Match EXACTLY the patterns from existing tests.
- **Plan adherence**: Implement ALL test cases from `TEST_PLAN.toon`.
- **NEVER use PowerMockito**: Use standard Mockito only.
- **NEVER modify production code**: Design tests to work with production code as-is.

## Step 1: Gather Test Context (STOP POINT)
**Goal**: Create `TEST_CONTEXT.toon` to capture the full test requirements.

1.  **STOP**: Ask the user the following questions:
    *   **Target Code**: What class/method needs to be tested?
    *   **Test Focus**: What specific functionality or behavior should be tested?
    *   **Priority Scenarios**: Are there specific scenarios or edge cases that are most important?
    *   **Known Issues**: Are there any known bugs or areas of concern to cover?
    *   **Coverage Goals**: Any specific coverage targets or requirements?
    *   **Existing Tests**: Are there existing tests to reference or extend?
2.  Create `TEST_CONTEXT.toon` documenting all answers.
3.  **Do not proceed** until the user provides this context.

## Step 2: Analyze & Plan
**Goal**: Create `TEST_PLAN_[nameoftask].toon` BASED ON the context gathered.

1.  **RE-ANCHOR**: Read `TEST_CONTEXT.toon`. Output: "TEST REQUIREMENTS: [one-line description of what needs to be tested]"
2.  Analyze code to test (focused on areas from context).
3.  Find existing test patterns.
4.  Create `TEST_PLAN.toon`:
    *   Code Analysis (branches, edge cases - prioritized by context).
    *   Existing Patterns (framework, naming).
    *   Test Cases Needed (aligned with user's priority scenarios).

## Step 3: Plan Review (STOP POINT)
**Goal**: Approve test cases.

1.  **RE-ANCHOR**: Read `TEST_CONTEXT.toon`. Output: "TEST REQUIREMENTS: [one-line description of what needs to be tested]"
2.  **STOP**: Review `TEST_PLAN.toon`.
3.  Approve or request more cases.

## Step 4: Write Tests
**Goal**: Implement the test class.

1.  **RE-ANCHOR**: Read `TEST_CONTEXT.toon` and `TEST_PLAN.toon`. Output: "TEST REQUIREMENTS: [one-line description]" | "TEST CASES: [number of test cases to implement]"
2.  Write tests matching `TEST_PLAN.toon`.
3.  Match existing patterns exactly (from Reference Test File).
4.  **Auto-Test**:
    1.  **Auto-Detect Test Environment** (ONCE per workflow):
        - Scan project config files:
          * `package.json` → Jest/Vitest/Mocha/Karma/Jasmine
          * `pom.xml` / `build.gradle` → JUnit/TestNG/Mockito version
          * `requirements.txt` / `pyproject.toml` → pytest/unittest
          * `go.mod` → Go testing
          * `Cargo.toml` → Rust testing
        - Find existing test files → extract framework, mocking library, assertion style
        - Document in `TEST_ENVIRONMENT`:
          * Framework: [detected]
          * Mocking: [detected]
          * Patterns: [reference test file path]
        - If detection fails or conflicts: ASK user.
    2.  For each modified method: check if test exists.
    3.  If exists: Update test to match new business logic (do NOT remove/simplify cases).
    4.  If not exists: Write new test to increase code coverage.
    5.  **Test real code**: Mock ONLY as last resort when no other option.
    6.  **NEVER modify production code**: Design tests to work with production code as-is.
    7.  **Match detected patterns EXACTLY**: Same framework, assertions, naming, structure.
    8.  **Complex setup**: If required, implement full setup. If unclear, ASK user.
5.  Report: Tests added/updated: [list] | Environment: [detected framework]

// turbo
## Step 5: Verify Against Plan
**Goal**: Ensure nothing from the plan was missed.

1.  **RE-ANCHOR**: Read `TEST_CONTEXT.toon`. Output: "TEST REQUIREMENTS: [one-line description of what needs to be tested]"
2.  **Auto-Verify**:
    - Re-read `TEST_PLAN.toon`.
    - Read the actual implemented test code.
    - Compare actual test implementation vs planned test cases.
    - For each planned test: Verify it exists in actual code with correct assertions.
    - Compare Plan vs Implementation:
      | Planned Test | Implemented | Correct | File:Line |
    - Verify: All test cases from plan implemented in actual code? [Yes/No with test list]
    - Verify: All branches covered in actual tests? [Yes/No with branch list]
    - Verify: All edge cases covered in actual tests? [Yes/No with case list]
    - Report: Missing tests [list with file:line references] or COMPLETE.

## Step 6: Verify Coverage
**Goal**: Verify completeness.

1.  **RE-ANCHOR**: Read `TEST_CONTEXT.toon`. Output: "TEST REQUIREMENTS: [one-line description of what needs to be tested]"
2.  Check for missing branches or edge cases.
3.  **Checkpoint**: All planned tests implemented? [Yes/No]. Missing: [list or none].
4.  Confirm the original test requirements from context are met.
