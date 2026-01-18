# Release Upgrade Workflow

Use this when a bug appears after upgrading versions.
**CRITICAL**: Context is gathered FIRST, then code is analyzed based on that context.

**Note**: If unfamiliar with TOON (Token-Oriented Object Notation) format, perform a web search to understand the proper syntax before creating files.

## Guardrails
- **RE-ANCHOR at EVERY step**: State the broken functionality/context in one line before doing ANY work.
- **Context-first**: Never analyze diffs without understanding the issue first.
- **Claims require evidence**: Cite `[file:line]` or diff output for assertions.
- **Implementation**: List files touched; flag any outside fix scope.

## Step 1: Gather Upgrade Context (STOP POINT)
**Goal**: Create `UPGRADE_CONTEXT.toon` to capture the full problem understanding.

1.  **STOP**: Ask the user the following questions:
    *   **Broken Functionality**: What exactly stopped working after the upgrade?
    *   **Previous Version**: What version was working before?
    *   **New Version**: What version was upgraded to?
    *   **Upgrade Scope**: What was upgraded? (Library, framework, internal module, etc.)
    *   **Symptoms**: What are the exact error messages or unexpected behaviors?
    *   **Affected Areas**: Which features/modules are affected?
    *   **Suspected Changes**: Any specific changes the user suspects?
2.  Create `UPGRADE_CONTEXT.toon` documenting all answers.
3.  **Do not proceed** until the user provides this context.

## Step 2: Analyze Version Differences
**Goal**: Create `VERSION_DIFF.toon` BASED ON the context gathered.

1.  **RE-ANCHOR**: Read `UPGRADE_CONTEXT.toon`. Output: "BROKEN FUNCTIONALITY: [one-line description of what stopped working]"
2.  Run `git diff` between versions (focused on areas from context).
3.  Check dependency and config changes.
4.  Create `VERSION_DIFF.toon` (Code, Dependency, Config, API changes).

// turbo
## Step 3: Impact Analysis
**Goal**: Map changes to the bug.

1.  **RE-ANCHOR**: Read `UPGRADE_CONTEXT.toon` and `VERSION_DIFF.toon`. Output: "BROKEN FUNCTIONALITY: [one-line description of what stopped working]"
2.  Create `IMPACT_ANALYSIS.toon` (cite evidence for each likelihood rating).
3.  Identify the "Most Likely Culprit".

## Step 4: Confirm Culprit (STOP POINT)
**Goal**: User confirms the root cause.

1.  **RE-ANCHOR**: Read `UPGRADE_CONTEXT.toon`. Output: "BROKEN FUNCTIONALITY: [one-line description of what stopped working]"
2.  **STOP**: Review `IMPACT_ANALYSIS.toon`.
3.  Confirm which change is causing the issue.

## Step 5: Propose Fix Strategies
**Goal**: Create `FIX_OPTIONS.toon`.

1.  **RE-ANCHOR**: Read `UPGRADE_CONTEXT.toon`. Output: "BROKEN FUNCTIONALITY: [one-line description of what stopped working]"
2.  Create `FIX_OPTIONS.toon` with:
    *   Option A: Adapt to New Behavior.
    *   Option B: Restore Old Behavior.
    *   Recommendation.

## Step 6: Strategy Selection (STOP POINT)
**Goal**: User selects a strategy.

1.  **RE-ANCHOR**: Read `UPGRADE_CONTEXT.toon`. Output: "BROKEN FUNCTIONALITY: [one-line description of what stopped working]"
2.  **STOP**: Choose Option A or B.

## Step 7: Implementation
**Goal**: Implement chosen strategy.

1.  **RE-ANCHOR**: Re-read `UPGRADE_CONTEXT.toon` and `FIX_OPTIONS.toon`. Output: "BROKEN FUNCTIONALITY: [one-line description]" | "CHOSEN OPTION: [A or B]" | "DOING: [what this option does]"
2.  Create `PRE_FIX` git tag.
3.  Implement the chosen option.
4.  **Phase Checkpoint**:
    - Files modified: [list]. Any outside fix scope? [Yes/No]
    - Is this approach different from any previously failed attempts? [Yes/No]
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
## Step 8: Verify Against Strategy
**Goal**: Ensure nothing from the strategy was missed.

1.  **RE-ANCHOR**: Read `UPGRADE_CONTEXT.toon`. Output: "BROKEN FUNCTIONALITY: [one-line description of what stopped working]"
2.  **Auto-Verify**:
    - Re-read `FIX_OPTIONS.toon` and chosen strategy.
    - Read the actual implemented code in all modified files.
    - Compare actual implementation vs chosen strategy components.
    - Verify: All components of chosen option implemented in actual code? [Yes/No with component list]
    - Verify: No unintended changes made in actual code? [Yes/No with any extra changes]
    - Verify: Broken functionality restored in actual implementation? [Yes/No with evidence]
    - Report: Missing items [list with file:line references] or COMPLETE.
3.  Confirm the original broken functionality is restored.

## Step 9: Trigger Test-Writing Workflow
**Goal**: Ensure comprehensive test coverage for all changes made.

1.  **RE-ANCHOR**: Read `UPGRADE_CONTEXT.toon` and `FIX_OPTIONS.toon`. Output: "BROKEN FUNCTIONALITY: [one-line description]" | "CHANGES: [list of modified files]"
2.  **Trigger**: Invoke the `/test-writing` workflow with the following context:
    - Files modified: [list from implementation]
    - Methods added/changed: [list with file:line]
    - Fix strategy applied: [Option A or B summary]
    - Edge cases to cover: [based on the upgrade issue that was fixed]
3.  **Handoff**: The test-writing workflow will handle test creation/updates for all changes.
