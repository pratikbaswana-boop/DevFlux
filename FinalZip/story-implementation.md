# Story Implementation Workflow

This workflow automates the process for implementing new user stories or features.
**CRITICAL**: Context is gathered FIRST, then code patterns are analyzed based on that context.

**Note**: If unfamiliar with TOON (Token-Oriented Object Notation) format, perform a web search to understand the proper syntax before creating files.

## Guardrails
- **RE-ANCHOR at EVERY step**: State the story goal/requirements in one line before doing ANY work.
- **Context-first**: Never search code without understanding the requirements first.
- **Pattern adherence**: Follow ONLY patterns from `CODEBASE_PATTERNS.toon`.
- **Implementation**: List files touched; flag any outside `DESIGN.toon` scope.

## Step 1: Gather Story Context (STOP POINT)
**Goal**: Create `STORY_CONTEXT.toon` to capture the full requirements.

1.  **STOP**: Ask the user the following questions:
    *   **Story/Feature**: What is the user story or feature to implement? What is the end goal?
    *   **Acceptance Criteria**: What are the specific acceptance criteria or success conditions?
    *   **User Flow**: What is the expected user flow or interaction?
    *   **Scope Boundaries**: What is explicitly OUT of scope?
    *   **Dependencies**: Are there any dependencies on other features or external systems?
    *   **Similar Features**: Are there any similar existing features in the codebase to reference?
    *   **Constraints**: Any technical constraints, performance requirements, or limitations?
2.  Create `STORY_CONTEXT.toon` documenting all answers.
3.  **Do not proceed** until the user provides this context.

## Step 2: Learn Codebase Patterns
**Goal**: Create `CODEBASE_PATTERNS.toon` BASED ON the context gathered.

1.  **RE-ANCHOR**: Read `STORY_CONTEXT.toon`. Output: "STORY GOAL: [one-line description of the feature to implement]"
2.  Find a SIMILAR existing feature in the codebase (using hints from context).
3.  Create `CODEBASE_PATTERNS.toon` containing:
    *   Reference Feature Analyzed
    *   Architecture Pattern
    *   Naming Conventions
    *   Error Handling & Logging Patterns
    *   Existing Utilities to Reuse

// turbo
## Step 3: Create Design Document
**Goal**: Create `DESIGN.toon`.

1.  **RE-ANCHOR**: Read `STORY_CONTEXT.toon` and `CODEBASE_PATTERNS.toon`. Output: "STORY GOAL: [one-line description of the feature to implement]"
2.  Create `DESIGN.toon` containing:
    *   Components (New/Modified)
    *   Data Model & API Contract
    *   Dependencies
    *   **Definition of Done**
    *   **Decisions Log**
    *   **Do Not Touch List**
    *   Rollback Points
3.  **STOP**: Ask user to review `DESIGN.toon`.

## Step 4: Design Review (STOP POINT)
**Goal**: Get approval on the design.

1.  **RE-ANCHOR**: Read `STORY_CONTEXT.toon`. Output: "STORY GOAL: [one-line description of the feature to implement]"
2.  Do not proceed until the user approves the design or requests changes.
3.  If changes are requested, update `DESIGN.toon` and re-request approval.

## Step 5: Implementation Phases
**Goal**: Implement in phases.

1.  **RE-ANCHOR**: Re-read `STORY_CONTEXT.toon`, `DESIGN.toon` and `CODEBASE_PATTERNS.toon`. Output: "STORY GOAL: [one-line description]" | "PHASE: [current phase]" | "DOING: [what this phase does]" | "REMAINING: [what remains]"
2.  **Constraint Check**: Re-read "Do Not Touch" list.
3.  **Phase Execution**:
    *   Implement Phase from `DESIGN.toon`.
    *   **Phase Checkpoint**:
        - Files modified: [list]. Any outside `DESIGN.toon` scope? [Yes/No]
        - "Do Not Touch" violations? [Yes/No]
        - Pattern deviations from `CODEBASE_PATTERNS.toon`? [Yes/No]
        - Verify dependencies, imports, and functionality.
// turbo
    *   **Auto-Test**:
        - For each modified method: check if test exists.
        - If exists: Update test to match new business logic (do NOT remove/simplify cases).
        - If not exists: Write new test to increase code coverage.
        - **Test real code**: Mock ONLY as last resort when no other option.
        - **Framework**: Java = TestNG; UI = Karma + Jasmine.
        - **Complex setup**: If required, implement full setup. If unclear, ASK user.
        - Report: Tests added/updated: [list]
4.  **Loop**: Ask for approval to proceed to the next phase.

## Step 6: Verify Dependencies
**Goal**: Ensure implementation completeness.

1.  **RE-ANCHOR**: Read `STORY_CONTEXT.toon`. Output: "STORY GOAL: [one-line description of the feature to implement]"
2.  For each phase, verify:
    *   All imports exist in project.
    *   All injected beans/services exist.
    *   All called methods are accessible.
    *   All config properties exist.
3.  Report: Missing dependencies [list] or PASS.
4.  Confirm the original story requirements are met.

## Step 7: Trigger Test-Writing Workflow
**Goal**: Ensure comprehensive test coverage for all changes made.

1.  **RE-ANCHOR**: Read `STORY_CONTEXT.toon` and `DESIGN.toon`. Output: "STORY GOAL: [one-line description]" | "CHANGES: [list of modified files]"
2.  **Trigger**: Invoke the `/test-writing` workflow with the following context:
    - Files modified: [list from implementation]
    - Methods added/changed: [list with file:line]
    - New features implemented: [summary from DESIGN.toon]
    - Acceptance criteria to verify: [from STORY_CONTEXT.toon]
3.  **Handoff**: The test-writing workflow will handle test creation/updates for all changes.
