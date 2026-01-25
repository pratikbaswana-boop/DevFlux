# Story Context: DevFlux Landing Page Restructure for 2-Second Clarity

## Story/Feature
Restructure the DevFlux landing page so visitors understand exactly what DevFlux does within 2 seconds of landing. DevFlux sells AI coding workflow files (₹899) that help developers use Cursor, Windsurf, and Claude effectively.

**Core Problem**: Current page requires scrolling through 8+ sections to understand the product. Conversion is low because value isn't immediately clear.

## Acceptance Criteria
1. Hero section shows before/after comparison above the fold
2. Terminal-like animation showing `/quick-fix` command in action (create new)
3. 6 workflow commands displayed clearly with time savings
4. Simplified 6-section structure (Hero → Commands → How It Works → Proof → Pricing → FAQ)
5. Remove ROI Calculator entirely
6. Remove/relocate "Why Your AI Strategy Is Failing" section
7. Remove abstract stats cards (300%, 92%, 10x) from hero
8. Mobile-optimized with red/green color coding for before/after states
9. CTA button shows price upfront: "Get 6 Workflows - ₹899"

## User Flow
1. Land on page → See hero with before/after comparison immediately
2. Understand value proposition in 2 seconds
3. See the 6 commands with clear time savings
4. See how simple setup is (3 steps)
5. See proof (90-developer team results + FyndFox case study)
6. See pricing and buy

## New Page Structure (Top to Bottom)

### Section 1: Hero (Above fold) - CRITICAL
- Headline: "Stop Babysitting Your AI. Start Shipping." (keep)
- Subheadline: "6 workflow commands that turn Cursor & Windsurf into senior developers"
- Before/After visual comparison (move existing from HowSimpleIsIt to hero)
  - Left (red): Developer asking "Fix this payment bug" → AI guessing → 3 hours wasted
  - Right (green): Developer types /complex-issue → AI finds root cause → 15 minutes done
- Terminal animation showing /quick-fix command (CREATE NEW)
- CTA: "Get 6 Workflows - ₹899"
- Social proof: "Used by 90 developers shipping 10x faster"

### Section 2: The 6 Commands (Show don't tell)
- Grid showing all 6 commands: /quick-fix, /complex-issue, /story, /refactor, /tests, /upgrade
- Each with ONE line description and time saved
- Clickable to expand with example

### Section 3: How It Works (3 steps max)
- Download ZIP
- Drop in folder  
- Type command, ship code
- Keep existing terminal/IDE visual from SetupSection

### Section 4: Proof
- Before/After results from real team (90-person team stat)
- FyndFox case study as proof

### Section 5: Pricing
- Single clear price card
- Emphasize: One-time payment, lifetime access, works with Cursor/Windsurf/Claude

### Section 6: FAQ (minimal)

## Sections to REMOVE
- ROI Calculator (ROICalculator.tsx) - DELETE
- Problem section ("Why Your AI Strategy Is Failing") - DELETE
- Stats cards in Hero (300%, 92%, 10x) - REMOVE from Hero
- Guarantee section - REMOVE (redundant with pricing)

## Sections to MOVE/MODIFY
- Before/After comparison from HowSimpleIsIt → Move to Hero
- 6 Commands showcase from HowSimpleIsIt → Make into dedicated section with expandable cards
- SetupSection → Simplify to 3 steps only

## Copy Changes
| Current | Change To |
|---------|-----------|
| "6 workflows. Instant setup. 90% success rate." | "6 commands. 15 minutes to fix what took 3 hours." |
| "Cursor, Windsurf & Copilot work—when you know how to use them." | "Stop prompting. Start commanding." |
| "6 Battle-Tested Playbooks" | "6 Commands That Actually Work" |
| "Proven with 90+ developers" | "Used by 90 developers shipping 10x faster" |

## Design & Animation Requirements
1. Hero animation: Auto-play before/after as typing animation
2. Terminal animation: Create new component showing /quick-fix being typed with instant results
3. Red for "before/problem" states, green for "after/solution" states
4. Mobile: Before/after should stack vertically
5. Scroll-triggered animations for workflow commands

## Scope Boundaries
- OUT: Payment/Razorpay integration (keep as-is)
- OUT: Backend changes
- OUT: Database changes

## Dependencies
- Existing component library (shadcn/ui)
- Framer Motion for animations
- Existing BuyNowButton component
- Existing Pricing component (modify)

## The 6 Workflows (verified from FinalZip)
1. `/quick-fix` - Known bugs → 15 min instead of 2 hours
2. `/complex-issue` - Mystery bugs → 1 day instead of 1 week
3. `/story` - New features → 1 day instead of 3 days
4. `/refactor` (bigcodechange.md) - Big changes → 2 days instead of 5 days
5. `/tests` - Full coverage → 45 min instead of 4 hours
6. `/upgrade` (release-upgrade.md) - Dependencies → 3 hours instead of 2 days
