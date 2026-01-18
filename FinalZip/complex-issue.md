# Complex Issue Resolution Workflow

This workflow automates the process for resolving complex issues (bugs, race conditions, etc.).
**CRITICAL**: Context is gathered FIRST, then code is analyzed based on that context.

**Note**: If unfamiliar with TOON (Token-Oriented Object Notation) format, perform a web search to understand the proper syntax before creating files.

## Guardrails
- **RE-ANCHOR at EVERY step**: State the original issue/context in one line before doing ANY work.
- **Context-first**: Never search code without understanding the issue first.
- **Claims require evidence**: Cite `[file:line]` for any assertion.
- **Implementation steps**: List files touched; flag any outside plan scope.

## Step 1: Gather Issue Context (STOP POINT)
**Goal**: Create `ISSUE_CONTEXT.toon` to capture the full problem understanding.

1.  **STOP**: Ask the user the following questions:
    *   **Issue Description**: What exactly is the problem? Describe the expected vs actual behavior.
    *   **Frequency**: How often does this issue occur? (Always, Intermittent, Rare)
    *   **Scenario**: What specific scenario/conditions trigger this issue?
    *   **Entry Points**: What user actions, APIs, or triggers lead to this issue?
    *   **Existing Findings**: Does the dev team already have any findings, suspicions, or prior investigation notes?
    *   **Known Components**: Are there any specific classes, methods, or modules the user suspects?
2.  Create `ISSUE_CONTEXT.toon` documenting all answers.
3.  **Do not proceed** until the user provides this context.

## Step 2: Call Chain Mapping
**Goal**: Create `CALL_CHAIN.toon` to map execution flow with critical details BASED ON the context gathered.

1.  **RE-ANCHOR**: Read `ISSUE_CONTEXT.toon`. Output: "ISSUE: [one-line description of the problem]"
2.  **CRITICAL - Chronological Step-by-Step Understanding**:
    *   **FIRST**: Understand the issue timeline from user's perspective:
        - What did the user do FIRST? (e.g., clicked a button, called an API)
        - What happened NEXT? (e.g., request sent, service called)
        - What happened AFTER THAT? (e.g., processing started, state changed)
        - Continue until the issue occurred
    *   **THEN**: For EACH step in this timeline, read the corresponding code:
        - Step 1 action → Find and read the code that handles this action
        - Step 2 action → Find and read the code that handles this action
        - Continue for ALL steps until the issue point
    *   **DO NOT** jump directly to suspected components - follow the chronological flow
3.  Search the codebase for files related to the issue using context from Step 1.
4.  Create `CALL_CHAIN.toon` **organized by chronological steps**:
    *   **Method signature**: Full class.method name
    *   **Type**: sync | async | async-background
    *   **Calls**: List of downstream methods/services called
        - Include type for each call: [sync] | [async] | [async-background]
    *   **Variables**:
        - Local variables: [list with types]
        - Global/static variables: [list with scope]
        - Shared objects/maps: [list with thread-safety notes]
    *   **Error handling**: try-catch | throws | none
    *   **Side effects**: DB writes, cache updates, external calls, etc.
    *   **Impact Map** (What breaks if X changes?)

**Example format** (organized by chronological steps):
```
## Timeline Step 1: User clicks "Pay" button
PaymentController.handlePayClick:
  type: sync (UI thread)
  calls:
    - PaymentService.process [async]
  variables:
    local: buttonEvent (ClickEvent)
  error_handling: try-catch

## Timeline Step 2: Payment processing starts
PaymentService.process:
  type: async
  calls:
    - StripeAdapter.charge [async]
    - OrderService.create [async]
  variables:
    local: paymentId (String), amount (BigDecimal)
    shared: paymentCache (ConcurrentHashMap, thread-safe)
  error_handling: try-catch
  side_effects: DB write, Redis cache update

## Timeline Step 3: Stripe charge initiated
StripeAdapter.charge:
  type: async
  calls:
    - StripeAPI.createCharge [async-external]
  variables:
    local: chargeRequest (ChargeRequest)
  error_handling: try-catch with retry

## Timeline Step 4: [Continue until issue occurs...]
```
5.  Report completion.

// turbo
## Step 3: Flow Analysis
**Goal**: Create `FLOW_ANALYSIS.toon` to trace data execution.

1.  **RE-ANCHOR**: Read `ISSUE_CONTEXT.toon` and `CALL_CHAIN.toon`. Output: "ISSUE: [one-line description of the problem]"
2.  **CRITICAL - Follow the Chronological Timeline from CALL_CHAIN.toon**:
    *   Read `CALL_CHAIN.toon` and follow the timeline steps in ORDER (Step 1 → Step 2 → Step 3 → ...)
    *   For EACH timeline step, trace:
        - What data enters at this step?
        - How is the data transformed?
        - What data exits to the next step?
        - What side effects occur?
    *   **DO NOT** analyze steps out of order - the issue may depend on the sequence
3.  Create `FLOW_ANALYSIS.toon` **organized by the same chronological steps**:
    *   **Timeline Step 1**: [First user action]
        - Data Entry: [what data comes in]
        - Processing: [what happens to the data]
        - Data Exit: [what data goes to next step]
        - Side Effects: [DB writes, cache updates, etc.]
        - Threading: [sync/async, thread context]
    *   **Timeline Step 2**: [Next action]
        - [Same structure as above]
    *   Continue for ALL steps until issue point
    *   **Issue Point**: Mark clearly where the issue occurs in the timeline
4.  Mark unclear items as `[UNCLEAR]`.

// turbo
## Step 4: Generate Hypotheses
**Goal**: Create `HYPOTHESES.toon` to identify root causes.

1.  **RE-ANCHOR**: Read `ISSUE_CONTEXT.toon`, `CALL_CHAIN.toon`, and `FLOW_ANALYSIS.toon`. Output: "ISSUE: [one-line description of the problem]"
2.  **CRITICAL - Read Timeline from Start to End Before Creating Any Hypothesis**:
    *   **FIRST**: Re-read the entire chronological timeline from `CALL_CHAIN.toon` and `FLOW_ANALYSIS.toon`:
        - Start from Timeline Step 1 (first user action)
        - Read through EVERY step in sequence
        - End at the issue point
    *   **FOR EACH STEP**: Read the actual code for that step completely:
        - Read the method implementation from start to end
        - Understand what happens at this step
        - Note any conditions, branches, or state changes
    *   **ONLY AFTER** reading the complete timeline can you form hypotheses
    *   **Hypotheses must explain**: At which timeline step does the issue occur and WHY?
3.  **CRITICAL - Code Verification Before Hypothesis Creation**:
    *   For EVERY decision-making parameter, variable, or API mentioned in a hypothesis:
        - **READ THE ACTUAL CODE FIRST** - Do NOT assume behavior
        - Verify the variable/API/method actually exists at `[file:line]`
        - Check if the assumed behavior is even possible in the code
        - Cite exact `[file:line]` for every claim
    *   **NEVER create a hypothesis based on assumptions** - all claims must be grounded in actual code
4.  Generate `HYPOTHESES.toon` containing at least 3 hypotheses, each with:
    *   **Timeline Step Where Issue Occurs**: Specify which step in the chronological timeline
    *   **Theory & Mechanism**: What you think is happening at that step
    *   **Call Chain for This Hypothesis**:
        - Entry method: [class.method with sync/async type]
        - Method sequence: [list each method call with sync/async/async-background]
        - Variables involved: [local/global/shared with types and scope]
        - Decision points: [conditions/flags that affect flow]
    *   **Code Evidence** (cite `[file:line]` for EVERY item):
        - Variables: Prove they exist and show their scope
        - APIs/Methods: Show actual implementation, not assumed behavior
        - Conditions: Show actual if/switch logic
    *   **Evidence Against** (cite `[file:line]`)
    *   **Verification Steps**: How to test this hypothesis
    *   **Likelihood**: Based on actual code evidence
5.  Recommended Investigation Order.

// turbo
## Step 5: Validate Hypotheses Against Code
**Goal**: Verify each hypothesis by tracing through the actual codebase with hypothesis-specific inventory and flow.

1.  **RE-ANCHOR**: Read `ISSUE_CONTEXT.toon`. Output: "ISSUE: [one-line description of the problem]"
2.  For each hypothesis (in recommended investigation order):
    *   **CRITICAL - Complete Code Reading**:
        - **READ EVERY API COMPLETELY**: For each API/method mentioned in the hypothesis, read the ENTIRE method implementation from start to end
        - **READ EVERY VARIABLE COMPLETELY**: Trace each variable's declaration, initialization, all assignments, and all usages
        - **READ EVERY METHOD IN CALL CHAIN**: Read the complete implementation of every method in the call sequence
        - **Verify sync/async behavior**: Check actual thread creation, executor usage, Future/CompletableFuture usage
        - **Check shared state access**: Verify thread-safety mechanisms (synchronized, locks, concurrent collections)
        - **NO ASSUMPTIONS**: If you haven't read the complete code, you CANNOT validate
    *   **Create Hypothesis-Specific Call Chain**: In the existing `CALL_CHAIN.toon` file, add a new section:
        ```
        ## Hypothesis [N]: [Hypothesis Title]
        ### Call Chain Specific to This Hypothesis
        - Entry Method: [method signature with sync/async type]
        - Call Sequence: [list each call with sync/async/async-background type]
        - Shared State: [shared objects/maps with thread-safety details]
        - Variables in Scope: [local/global variables with types and lifecycle]
        - Code Evidence: [file:line for each item above]
        ```
    *   **Create Hypothesis-Specific Flow**: In the existing `FLOW_ANALYSIS.toon` file, add a new section:
        ```
        ## Hypothesis [N]: [Hypothesis Title]
        ### Flow Trace for This Hypothesis
        - Entry Point: [where the issue starts - file:line]
        - Step-by-Step: [trace the specific flow with file:line for each step]
        - Decision Points: [if/switch conditions that affect flow - file:line]
        - Failure Point: [where this hypothesis claims the issue occurs - file:line]
        - Evidence: [cite file:line for EVERY step with actual code snippets]
        ```
    *   **Validate Using the Hypothesis-Specific Call Chain & Flow**:
        - Re-read the hypothesis-specific sections just created.
        - Verify if the theoretical mechanism is actually possible based on COMPLETE code reading.
        - Check if the issue scenario matches the code behavior traced.
        - Verify all sync/async assumptions against actual code.
        - Verify all variable scope and lifecycle assumptions.
    *   **100% Validation Checklist** (ALL must be checked for 100% validation):
        ```
        [ ] Every method in call chain: COMPLETE code read (start to end)
        [ ] Every variable: Declaration, initialization, ALL assignments, ALL usages traced
        [ ] Every API call: Complete implementation read
        [ ] Every shared object/map: Thread-safety verified
        [ ] Every sync/async claim: Verified against actual executor/thread code
        [ ] Every decision point: Actual if/switch logic read and understood
        [ ] Every file:line citation: Actually read and verified
        ```
    *   **Validation Status**:
        - **100% VALIDATED**: ALL checklist items completed with evidence
        - **PARTIALLY VALIDATED**: Some items not fully read - specify which
        - **INVALIDATED**: Code evidence contradicts hypothesis - explain what
    *   **ONLY 100% VALIDATED hypotheses can be presented to user**
3.  Update `HYPOTHESES.toon` with validation results:
    - Mark each hypothesis with validation status (100% VALIDATED / PARTIALLY VALIDATED / INVALIDATED)
    - For 100% VALIDATED: Include completed checklist with file:line evidence
    - For PARTIALLY VALIDATED: List what was NOT fully read
    - For INVALIDATED: Explain contradicting code evidence
4.  Rank only 100% VALIDATED hypotheses by likelihood based on code evidence.

## Step 6: User Confirmation (STOP POINT)
**Goal**: Confirm the root cause before planning.

1.  **RE-ANCHOR**: Read `ISSUE_CONTEXT.toon`. Output: "ISSUE: [one-line description of the problem]"
2.  **CRITICAL**: Only present **100% VALIDATED** hypotheses to the user.
    - Do NOT present PARTIALLY VALIDATED or INVALIDATED hypotheses as options.
    - If no hypothesis is 100% validated, inform user and ask if you should:
        - Complete the remaining code reading for partially validated hypotheses, OR
        - Generate new hypotheses based on findings
3.  **STOP**: Present only 100% VALIDATED hypotheses with:
    - Summary of the hypothesis
    - Completed validation checklist
    - Key code evidence (file:line citations)
4.  Ask the user to confirm which hypothesis is the root cause or if further investigation is needed.
5.  **Do not proceed** until the user explicitly confirms a root cause (e.g., "Confirmed: Hypothesis 1").

## Step 7: Implementation Plan
**Goal**: Create `IMPLEMENTATION_PLAN.toon`.

1.  **RE-ANCHOR**: Read `ISSUE_CONTEXT.toon`, `CALL_CHAIN.toon`, `FLOW_ANALYSIS.toon`, confirmed root cause. Output: "ISSUE: [one-line description]" and "ROOT CAUSE: [one-line description]"
2.  Create `IMPLEMENTATION_PLAN.toon` containing:
    *   Overview & **Definition of Done**
    *   **Do Not Touch List** (Crucial!)
    *   Phased Approach (if >300 lines)
    *   For each phase: Files to Modify, New Files, Dependencies, Tests.
    *   **Rollback Points** (Git tags/revert commands).
3.  **STOP**: Ask user to review and approve the plan.

## Step 8: Implementation & Verification
**Goal**: Execute the plan in phases.

1.  **RE-ANCHOR**: Re-read `ISSUE_CONTEXT.toon` and `IMPLEMENTATION_PLAN.toon`. Output: "ISSUE: [one-line description]" | "PHASE: [current phase]" | "DOING: [what this phase does]" | "REMAINING: [what remains]"
2.  **Constraint Check**: Re-read the "Do Not Touch" list.
3.  **Phase Execution**:
    *   Implement exactly as planned.
    *   **Phase Checkpoint**:
        - Files modified: [list]. Any outside plan? [Yes/No]
        - "Do Not Touch" violations? [Yes/No]
        - Is this approach different from any previously failed attempts? [Yes/No]
// turbo
    *   **Auto-Test**:
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
## Step 9: Verify Against Plan
**Goal**: Ensure nothing from the plan was missed.

1.  **RE-ANCHOR**: Read `ISSUE_CONTEXT.toon`. Output: "ISSUE: [one-line description of the problem]"
2.  **Auto-Verify**:
    - Re-read `IMPLEMENTATION_PLAN.toon`.
    - For each file in plan: Read the actual implemented code and verify changes match plan.
    - Compare actual implementation vs planned changes in `IMPLEMENTATION_PLAN.toon`.
    - Verify: All files for current phase modified? [Yes/No with file list]
    - Verify: All new files created? [Yes/No with file list]
    - Verify: All dependencies added in actual code? [Yes/No with dependency list]
    - Verify: Definition of Done criteria met in actual implementation? [Yes/No with criteria list]
    - Report: Missing items [list with file:line references] or COMPLETE.
3.  **Loop**: If more phases exist, ask user for approval to proceed to next phase, then repeat.

## Step 10: Trigger Test-Writing Workflow
**Goal**: Ensure comprehensive test coverage for all changes made.

1.  **RE-ANCHOR**: Read `ISSUE_CONTEXT.toon` and `IMPLEMENTATION_PLAN.toon`. Output: "ISSUE: [one-line description]" | "CHANGES: [list of modified files]"
2.  **Trigger**: Invoke the `/test-writing` workflow with the following context:
    - Files modified: [list from implementation]
    - Methods added/changed: [list with file:line]
    - Business logic changes: [summary of what changed]
    - Edge cases to cover: [based on the issue that was fixed]
3.  **Handoff**: The test-writing workflow will handle test creation/updates for all changes.
