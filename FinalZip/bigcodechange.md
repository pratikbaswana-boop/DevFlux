# Big Code Changes Workflow

Use for large migrations or refactors affecting >10 files.
**CRITICAL**: Context is gathered FIRST, then code is analyzed based on that context.

**Note**: If unfamiliar with TOON (Token-Oriented Object Notation) format, perform a web search to understand the proper syntax before creating files.

## Guardrails
- **RE-ANCHOR at EVERY step**: State the migration goal/context in one line before doing ANY work.
- **Context-first**: Never search code without understanding the migration requirements first.
- **Batch execution**: Apply ONLY patterns from `PATTERN_MAPPING.toon`; flag new patterns.
- **Scope check**: List files touched per batch; flag any outside batch scope.

## Step 1: Gather Migration Context (STOP POINT)
**Goal**: Create `MIGRATION_CONTEXT.toon` to capture the full migration requirements.

1.  **STOP**: Ask the user the following questions:
    *   **Migration Goal**: What exactly needs to be migrated/refactored? What is the end state?
    *   **Reason**: Why is this migration needed? (Tech debt, upgrade, new pattern, etc.)
    *   **Scope Hints**: Are there specific modules, packages, or file patterns to target?
    *   **Constraints**: Any files/modules that must NOT be touched?
    *   **Dependencies**: Are there external dependencies or downstream impacts?
    *   **Timeline/Priority**: Any batching preferences or priority order?
2.  Create `MIGRATION_CONTEXT.toon` documenting all answers.
3.  **Do not proceed** until the user provides this context.

## Step 2: Assess Scope
**Goal**: Create `SCOPE_ASSESSMENT.toon` BASED ON the context gathered.

1.  **RE-ANCHOR**: Read `MIGRATION_CONTEXT.toon`. Output: "MIGRATION GOAL: [one-line description of what needs to be migrated]"
2.  Search for all affected files using context from Step 1.
3.  Categorize by complexity (Simple/Medium/Complex).
4.  Create `SCOPE_ASSESSMENT.toon`.

// turbo
## Step 3: Pattern Mapping
**Goal**: Create `PATTERN_MAPPING.toon`.

1.  **RE-ANCHOR**: Read `MIGRATION_CONTEXT.toon` and `SCOPE_ASSESSMENT.toon`. Output: "MIGRATION GOAL: [one-line description of what needs to be migrated]"
2.  Analyze one representative file from each category.
3.  Create `PATTERN_MAPPING.toon` (Old -> New patterns).
4.  Define Migration Checklist.

// turbo
## Step 4: Batch Planning
**Goal**: Create `BATCH_PLAN.toon`.

1.  **RE-ANCHOR**: Read `MIGRATION_CONTEXT.toon`. Output: "MIGRATION GOAL: [one-line description of what needs to be migrated]"
2.  Create `BATCH_PLAN.toon` breaking work into batches of 5-10 files.
3.  Define **Rollback Points** (git tags) for each batch.

## Step 5: Plan Approval (STOP POINT)
**Goal**: User approves the batch plan.

1.  **RE-ANCHOR**: Read `MIGRATION_CONTEXT.toon`. Output: "MIGRATION GOAL: [one-line description of what needs to be migrated]"
2.  **STOP**: Review `PATTERN_MAPPING.toon` and `BATCH_PLAN.toon`.
3.  Approve to start Batch 1.

## Step 6: Migrate Batch
**Goal**: Execute migration for a batch.

1.  **RE-ANCHOR**: Read `MIGRATION_CONTEXT.toon`, `PATTERN_MAPPING.toon` and `BATCH_PLAN.toon`. Output: "MIGRATION GOAL: [one-line description]" | "BATCH: [current batch number]" | "FILES IN SCOPE: [list of files]"
2.  **Constraint**: Apply ONLY patterns from mapping.
3.  Migrate files in current batch.
4.  **Phase Checkpoint**:
    - Files modified: [list]. Any outside batch? [Yes/No]
    - New patterns found (not in mapping)? [Yes/No - STOP if Yes]
    - Is this approach different from any previously failed attempts? [Yes/No]
    - Verify imports, types, tests.
// turbo
5.  **Auto-Test**:
    - For each modified method: check if test exists.
    - If exists: Update test to match new business logic (do NOT remove/simplify cases).
    - If not exists: Write new test to increase code coverage.
    - **Test real code**: Mock ONLY as last resort when no other option.
    - **NEVER use PowerMockito**: Use standard Mockito only.
    - **NEVER modify production code**: Design tests to work with production code as-is.
    - **Framework**: Java = TestNG; UI = Karma + Jasmine.
    - **Complex setup**: If required, implement full setup. If unclear, ASK user.
    - Report: Tests added/updated: [list]

// turbo
## Step 7: Verify Against Plan
**Goal**: Ensure nothing from the plan was missed.

1.  **RE-ANCHOR**: Read `MIGRATION_CONTEXT.toon`. Output: "MIGRATION GOAL: [one-line description of what needs to be migrated]"
2.  **Auto-Verify**:
    - Re-read `BATCH_PLAN.toon` and `PATTERN_MAPPING.toon`.
    - For each file in batch plan: Read the actual implemented code and verify patterns applied.
    - Compare actual code changes vs expected patterns from `PATTERN_MAPPING.toon`.
    - Verify: All files from current batch modified? [Yes/No with file list]
    - Verify: All patterns from mapping applied in actual code? [Yes/No with pattern list]
    - Verify: All checklist items completed in actual implementation? [Yes/No with item list]
    - Report: Missing items [list with file:line references] or COMPLETE.
3.  If successful, create git tag for batch completion.
4.  **Loop**: Ask to proceed to next batch.

## Step 8: Trigger Test-Writing Workflow
**Goal**: Ensure comprehensive test coverage for all changes made.

1.  **RE-ANCHOR**: Read `MIGRATION_CONTEXT.toon` and `BATCH_PLAN.toon`. Output: "MIGRATION GOAL: [one-line description]" | "CHANGES: [list of modified files]"
2.  **Trigger**: Invoke the `/test-writing` workflow with the following context:
    - Files modified: [list from all batches]
    - Methods added/changed: [list with file:line]
    - Pattern changes applied: [summary from PATTERN_MAPPING.toon]
    - Edge cases to cover: [based on migration complexity]
3.  **Handoff**: The test-writing workflow will handle test creation/updates for all changes.
