# Quick Fix Workflow (AI Finds Solution)

Use this when you know the issue but need AI to find the root cause and fix it.
**CRITICAL**: Context is gathered FIRST, then code is analyzed based on that context.

**Note**: If unfamiliar with TOON (Token-Oriented Object Notation) format, perform a web search to understand the proper syntax before creating files.

## Guardrails
- **RE-ANCHOR at EVERY step**: State the issue/context in one line before doing ANY work.
- **Context-first**: Never search code without understanding the issue first.
- **Claims require evidence**: Cite `[file:line]` for root cause.
- **Implementation**: Change ONLY proposed lines; flag any additions.

## Step 1: Gather Issue Context (STOP POINT)
**Goal**: Understand the issue before searching any code.

1.  **STOP**: Ask the user the following questions:
    *   **Issue Description**: What exactly is the problem? Expected vs actual behavior?
    *   **Scenario**: What triggers this issue? Steps to reproduce?
    *   **Suspected Area**: Any specific file, method, or module you suspect?
    *   **Recent Changes**: Any recent changes that might have caused this?
2.  Document the answers mentally (or in `ISSUE_CONTEXT.toon` if complex).
3.  **Do not proceed** until the user provides this context.

## Step 2: Analyze and Propose
**Goal**: Identify root cause and propose a minimal fix BASED ON the context.

1.  **RE-ANCHOR**: Output: "ISSUE: [one-line description of the problem]"
2.  Read relevant code based on user's context.
3.  Identify root cause.
4.  Propose MINIMAL fix.
5.  Output:
    *   ISSUE (re-stated)
    *   ROOT CAUSE
    *   FILE
    *   CHANGE NEEDED
    *   LINES AFFECTED
    *   RISK

## Step 3: Approval (STOP POINT)
**Goal**: User approves the proposal.

1.  **RE-ANCHOR**: Output: "ISSUE: [one-line description of the problem]"
2.  **STOP**: Review the proposal.
3.  If approved, proceed to implementation.
4.  If not, refine the proposal.

## Step 4: Implement Fix
**Goal**: Apply the approved fix.

1.  **RE-ANCHOR**: Output: "ISSUE: [one-line description of the problem]"
2.  Implement EXACTLY what was proposed.
3.  Change ONLY the specific lines.
4.  Match existing code style.
5.  **Checkpoint**: Files modified: [list]. Any outside proposal? [Yes/No]
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
## Step 5: Verify Against Proposal
**Goal**: Ensure nothing from the proposal was missed.

1.  **RE-ANCHOR**: Output: "ISSUE: [one-line description of the problem]"
2.  **Auto-Verify**:
    - Re-read the proposal from Step 2.
    - Read the actual implemented code in the modified files.
    - Compare actual code changes vs proposed changes line-by-line.
    - Verify: Exact lines modified as proposed? [Yes/No with line references]
    - Verify: No additional changes made? [Yes/No with any extra changes listed]
    - Verify: Code style matches existing code? [Yes/No with style issues]
    - Report: Deviations [list with file:line references] or COMPLETE.
3.  Confirm the original issue is resolved.

## Step 6: Trigger Test-Writing Workflow
**Goal**: Ensure comprehensive test coverage for the fix.

1.  **RE-ANCHOR**: Output: "ISSUE: [one-line description]" | "CHANGES: [list of modified files]"
2.  **Trigger**: Invoke the `/test-writing` workflow with the following context:
    - Files modified: [list from implementation]
    - Methods added/changed: [list with file:line]
    - Fix applied: [summary of what was fixed]
    - Edge cases to cover: [based on the issue that was fixed]
3.  **Handoff**: The test-writing workflow will handle test creation/updates for all changes.
