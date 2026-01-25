# DESIGN.md - Buy Now Button with Razorpay Integration

## Story Goal
Replace all "Book Free Audit" and "Get Started" buttons with "Buy Now" buttons that trigger Razorpay payment flow for ₹899/developer subscription.

---

## Components

### New Components
| Component | Path | Description |
|-----------|------|-------------|
| `BuyNowButton` | `client/src/components/BuyNowButton.tsx` | Reusable button that triggers Razorpay checkout |
| `usePayment` | `client/src/hooks/use-payment.ts` | Hook for payment API calls |

### Modified Components
| Component | Path | Changes |
|-----------|------|---------|
| `Hero.tsx` | `client/src/components/sections/Hero.tsx` | Replace "Book Free Audit" with `<BuyNowButton>` |
| `Pricing.tsx` | `client/src/components/sections/Pricing.tsx` | Replace "Get Started" with `<BuyNowButton>` |
| `Home.tsx` | `client/src/pages/Home.tsx` | Replace nav "Book Audit" and final CTA with `<BuyNowButton>` |
| `index.html` | `client/index.html` | Add Razorpay checkout script |

### New Backend Files
| File | Path | Description |
|------|------|-------------|
| `payment.ts` | `server/payment.ts` | Razorpay payment routes (create-order, verify) |

### Modified Backend Files
| File | Path | Changes |
|------|------|---------|
| `routes.ts` | `server/routes.ts` | Import and register payment routes |
| `routes.ts` | `shared/routes.ts` | Add payment API contracts |
| `schema.ts` | `shared/schema.ts` | Add payment-related schemas |

---

## Data Model & API Contract

### Environment Variables (to be added to .env)
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
```

### API Endpoints

#### POST /api/payment/create-order
**Request:**
```typescript
{
  amount: number;      // Amount in paise (89900 for ₹899)
  currency: string;    // "INR"
  receipt?: string;    // Optional receipt ID
  notes?: object;      // Optional metadata
}
```

**Response (201):**
```typescript
{
  success: true;
  order: {
    id: string;        // Razorpay order_id
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
  key_id: string;      // Razorpay key_id for frontend
}
```

#### POST /api/payment/verify
**Request:**
```typescript
{
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
```

**Response (200):**
```typescript
{
  success: true;
  message: string;
  payment_id: string;
  order_id: string;
}
```

---

## Dependencies

### NPM Packages to Install
```bash
npm install razorpay crypto
```

### Frontend Script (CDN)
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## Definition of Done
- [ ] All "Book Free Audit" buttons replaced with "Buy Now"
- [ ] All "Get Started" buttons replaced with "Buy Now"
- [ ] Nav "Book Audit" button replaced with "Buy Now"
- [ ] Final CTA "Book Your Audit Now" replaced with "Buy Now"
- [ ] Razorpay checkout opens on button click
- [ ] Payment creates order via backend API
- [ ] Payment verification works after successful payment
- [ ] Success/failure states handled with user feedback
- [ ] AuditModal component can be removed/kept for reference

---

## Decisions Log
| Decision | Rationale |
|----------|-----------|
| Use CDN for Razorpay script | No npm package needed, recommended by Razorpay |
| Single BuyNowButton component | Reusable across all locations |
| Keep amount hardcoded to ₹899 | Single pricing tier, can be parameterized later |
| Use test keys initially | Production keys require KYC completion |

---

## Do Not Touch List
- `Problem.tsx` - No buttons to replace
- `HowSimpleIsIt.tsx` - No buttons to replace
- `Workflows.tsx` - No buttons to replace
- `ROICalculator.tsx` - No buttons to replace
- `FAQ.tsx` - No buttons to replace
- Database schema for audit_requests - Keep existing functionality

---

## Rollback Points
1. **After backend setup**: Can revert server/payment.ts and routes changes
2. **After frontend component**: Can revert BuyNowButton.tsx
3. **After button replacements**: Can restore AuditModal usage

---

## Implementation Phases

### Phase 1: Backend Setup
1. Add Razorpay dependency to package.json
2. Create `server/payment.ts` with create-order and verify endpoints
3. Update `server/routes.ts` to register payment routes
4. Add payment schemas to `shared/schema.ts`
5. Add payment API contracts to `shared/routes.ts`

### Phase 2: Frontend Setup
1. Add Razorpay script to `client/index.html`
2. Create `client/src/hooks/use-payment.ts` hook
3. Create `client/src/components/BuyNowButton.tsx` component

### Phase 3: Button Replacements
1. Update `Hero.tsx` - Replace "Book Free Audit" button
2. Update `Pricing.tsx` - Replace "Get Started" button
3. Update `Home.tsx` - Replace nav "Book Audit" and final CTA buttons

### Phase 4: Testing & Cleanup
1. Test payment flow with Razorpay test credentials
2. Verify all button replacements work correctly
3. Remove unused AuditModal imports (optional)

---

## Payment Status Popup Feature

### Story Goal
Show payment status (success/failure/cancel) as a themed popup with cool animations matching the dark theme.

### New Component
| Component | Path | Description |
|-----------|------|-------------|
| `PaymentStatusModal` | `client/src/components/PaymentStatusModal.tsx` | Animated modal showing payment result |

### Modified Component
| Component | Path | Changes |
|-----------|------|---------|
| `BuyNowButton.tsx` | `client/src/components/BuyNowButton.tsx` | Integrate PaymentStatusModal for status display |

### Component Design

#### PaymentStatusModal Props
```typescript
interface PaymentStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: "success" | "failure" | "cancelled";
  paymentId?: string;
  orderId?: string;
  errorMessage?: string;
}
```

#### Visual Design
- **Success State**:
  - Green checkmark icon with pulse animation
  - "Payment Successful!" title
  - Payment ID display
  - Confetti/sparkle animation
  - "Continue" button

- **Failure State**:
  - Red X icon with shake animation
  - "Payment Failed" title
  - Error message display
  - "Try Again" button

- **Cancelled State**:
  - Yellow warning icon
  - "Payment Cancelled" title
  - "Try Again" button

#### Animations (Framer Motion)

**Modal Container**
- Enter: scale(0.95→1) + opacity(0→1), duration 300ms, ease [0.32, 0.72, 0, 1]
- Exit: scale(1→0.95) + opacity(1→0), duration 200ms

**Success State**
- Checkmark: SVG path draw animation (500ms)
- Ring burst: scale(0→1.5) + opacity(1→0), 400ms
- 8 particles: random trajectory outward, staggered 50ms each

**Failure State**
- X icon: fade in + shake (translateX: [-8, 8, -6, 6, 0]), 400ms
- Optional: subtle screen shake on modal

**Content Stagger**
- Icon: delay 0ms
- Title: delay 150ms
- Details: delay 300ms
- Button: delay 450ms, all with opacity + translateY(10→0)

### Definition of Done (Payment Status Popup)
- [ ] PaymentStatusModal component created
- [ ] Success state with green checkmark and animation
- [ ] Failure state with red X and shake animation
- [ ] Cancelled state with warning icon
- [ ] BuyNowButton integrates modal for all payment outcomes
- [ ] Modal matches dark theme styling
- [ ] Smooth open/close animations

### Do Not Touch (Payment Status Popup)
- Existing Dialog UI component structure
- Payment API endpoints (already working)
- Other modal components (AuditModal)

### Implementation Phase
**Phase 5: Payment Status Popup**
1. Create `PaymentStatusModal.tsx` with three states
2. Add Framer Motion animations for icons and modal
3. Update `BuyNowButton.tsx` to show modal on payment result
4. Test all three states (success, failure, cancel)

---

## Secure File Download Feature

### Story Goal
After successful payment, automatically download a ZIP file stored on server. The file must only be downloadable with valid payment proof (no one can download without payment).

### Security Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                 SECURE DOWNLOAD FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│  1. Payment verified successfully                               │
│           ↓                                                      │
│  2. Backend generates signed download token                     │
│     Token = HMAC(payment_id + timestamp + secret)               │
│     Token expires in 5 minutes                                  │
│           ↓                                                      │
│  3. Backend returns download_token in verify response           │
│           ↓                                                      │
│  4. Frontend calls /api/download/:token                         │
│           ↓                                                      │
│  5. Backend validates token signature + expiry                  │
│           ↓                                                      │
│  6. If valid: Stream ZIP file to user                           │
│     If invalid: Return 403 Forbidden                            │
└─────────────────────────────────────────────────────────────────┘
```

### New Backend Files
| File | Path | Description |
|------|------|-------------|
| `download.ts` | `server/download.ts` | Secure download route with token validation |

### New Directory
| Directory | Path | Description |
|-----------|------|-------------|
| `protected` | `server/protected/` | Store ZIP files (not publicly accessible) |

### Modified Files
| File | Path | Changes |
|------|------|---------|
| `payment.ts` | `server/payment.ts` | Generate download token on successful verification |
| `routes.ts` | `server/routes.ts` | Register download routes |
| `BuyNowButton.tsx` | `client/src/components/BuyNowButton.tsx` | Trigger download after payment success |
| `PaymentStatusModal.tsx` | `client/src/components/PaymentStatusModal.tsx` | Show download progress/status |

### API Contract

#### Modified: POST /api/payment/verify
**Response (200) - Updated:**
```typescript
{
  success: true;
  message: string;
  payment_id: string;
  order_id: string;
  download_token: string;  // NEW: Signed token for secure download
  download_expires: number; // NEW: Token expiry timestamp
}
```

#### New: GET /api/download/:token
**Request:**
- URL param: `token` - Signed download token

**Response (200):**
- Content-Type: application/zip
- Content-Disposition: attachment; filename="devflux-package.zip"
- Body: ZIP file stream

**Response (403):**
```typescript
{
  success: false;
  error: "Invalid or expired download token"
}
```

**Response (404):**
```typescript
{
  success: false;
  error: "Download file not found"
}
```

### Environment Variables
```
DOWNLOAD_SECRET=your-secret-key-for-signing-tokens
```

### Token Structure
```typescript
// Token payload (base64 encoded)
{
  payment_id: string;
  timestamp: number;
  expires: number;  // timestamp + 5 minutes
}

// Token format: base64(payload).signature
// Signature: HMAC-SHA256(payload, DOWNLOAD_SECRET)
```

### Definition of Done (Secure Download)
- [ ] `server/protected/` directory created with sample ZIP
- [ ] Download token generation in payment verify endpoint
- [ ] Token validation with HMAC signature verification
- [ ] Token expiry check (5 minute window)
- [ ] Secure file streaming via Express
- [ ] Frontend triggers download on payment success
- [ ] Download progress shown in success modal
- [ ] Direct URL access returns 403 (no token bypass)

### Decisions Log (Secure Download)
| Decision | Rationale |
|----------|-----------|
| HMAC-signed tokens | Prevents token forgery, no database needed |
| 5-minute expiry | Short window reduces replay attack risk |
| Server-side file storage | Files not in public directory, can't be guessed |
| Single-use consideration | Optional: invalidate token after use |

### Do Not Touch (Secure Download)
- Existing payment create-order endpoint
- PaymentStatusModal animation logic
- Other API routes

### Rollback Points
1. **After token generation**: Can revert payment.ts changes
2. **After download endpoint**: Can remove download.ts
3. **After frontend integration**: Can revert BuyNowButton changes

### Implementation Phase
**Phase 6: Secure File Download**
1. Create `server/protected/` directory
2. Create `server/download.ts` with token validation and file serving
3. Update `server/payment.ts` to generate download token on verify
4. Update `server/routes.ts` to register download routes
5. Update `BuyNowButton.tsx` to trigger download on success
6. Update `PaymentStatusModal.tsx` to show download status

---

## Payment Cancellation Feedback Feature

### Story Goal
When user cancels payment, add a "Cancel" button below "Try Again". On click, card flips to show 4 feedback options. Save feedback to database.

### New Database Table
```sql
CREATE TABLE payment_feedback (
  id SERIAL PRIMARY KEY,
  feedback_reason TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  page_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### New/Modified Files
| File | Path | Changes |
|------|------|---------|
| `schema.ts` | `shared/schema.ts` | Add `paymentFeedback` table schema |
| `routes.ts` | `shared/routes.ts` | Add feedback API contract |
| `storage.ts` | `server/storage.ts` | Add `createPaymentFeedback` method |
| `feedback.ts` | `server/feedback.ts` | NEW: Feedback API endpoint |
| `routes.ts` | `server/routes.ts` | Register feedback routes |
| `PaymentStatusModal.tsx` | `client/src/components/PaymentStatusModal.tsx` | Add Cancel button, flip animation, feedback cards |
| `use-feedback.ts` | `client/src/hooks/use-feedback.ts` | NEW: Hook for feedback API |

### API Contract

#### POST /api/feedback
**Request:**
```typescript
{
  feedback_reason: string;  // "too_expensive" | "just_browsing" | "need_more_features" | "will_buy_later"
  user_agent?: string;
  referrer?: string;
  page_url?: string;
}
```

**Response (201):**
```typescript
{
  success: true;
  message: "Feedback submitted successfully"
}
```

### Animation Design (Enhanced)

#### Card Flip Animation with Spring Physics & Depth
```typescript
// Container needs perspective for 3D effect
const containerStyle = {
  perspective: "1000px"
};

// Front card - spring physics + scale keyframes for depth
const frontVariants = {
  initial: { rotateY: 0, scale: 1 },
  flipped: { 
    rotateY: 180, 
    scale: [1, 0.95, 1], // shrink mid-flip for 3D depth
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15 
    } 
  }
};

// Back card - spring physics + scale keyframes
const backVariants = {
  initial: { rotateY: -180, scale: 1 },
  flipped: { 
    rotateY: 0, 
    scale: [1, 0.95, 1],
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15 
    } 
  }
};

// Back card glassmorphism style
const backCardStyle = {
  backdropFilter: "blur(10px)",
  background: "rgba(15, 23, 42, 0.9)"
};
```

#### Feedback Card Hover with Gradient Border
```typescript
const feedbackCardVariants = {
  initial: { 
    scale: 1, 
    y: 0,
    background: "linear-gradient(135deg, #1a1a2e, #16213e)"
  },
  hover: { 
    scale: 1.05, 
    y: -8,
    background: "linear-gradient(135deg, #0f3460, #1a1a2e)",
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.3), 0 10px 40px rgba(0,0,0,0.4)",
    transition: { duration: 0.15, ease: "easeOut" }
  },
  tap: { scale: 0.98 }
};
```

#### Icon Animation on Hover
```typescript
const iconVariants = {
  initial: { rotate: 0, scale: 1 },
  hover: { 
    rotate: [0, -10, 10, 0], 
    scale: 1.2,
    transition: { duration: 0.4 }
  }
};
```

#### Stagger Animation for Cards
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};
```

#### Thank You Particle Burst
```typescript
const thankYouVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: [0, 1.1, 1], 
    opacity: 1,
    transition: { type: "spring", stiffness: 200 }
  }
};
```

### Style Improvements
| Current | Enhanced |
|---------|----------|
| Flat shadows | Multi-layered shadows with indigo tint |
| Instant hover | 150ms ease-out transitions |
| Static icons | Lucide icons with rotation animation |
| Plain background | Glassmorphism with backdrop blur |

### Feedback Options
| ID | Label | Icon |
|----|-------|------|
| `too_expensive` | "Too expensive" | DollarSign |
| `just_browsing` | "Just browsing" | Eye |
| `need_more_features` | "Need more features" | Sparkles |
| `will_buy_later` | "Will buy later" | Clock |

### UI Layout (Flipped Side)
```
┌─────────────────────────────────────┐
│     Why did you decide not to       │
│          purchase today?            │
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │     💰      │  │     👁️      │  │
│  │    Too      │  │    Just     │  │
│  │  expensive  │  │  browsing   │  │
│  └─────────────┘  └─────────────┘  │
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │     ✨      │  │     🕐      │  │
│  │   Need more │  │  Will buy   │  │
│  │  features   │  │   later     │  │
│  └─────────────┘  └─────────────┘  │
│                                     │
│         [Skip feedback]             │
└─────────────────────────────────────┘
```

### Definition of Done
- [ ] `paymentFeedback` table schema added
- [ ] Feedback API endpoint created
- [ ] Cancel button added below Try Again
- [ ] 3D card flip animation works
- [ ] 4 feedback cards display with hover effects
- [ ] Feedback saved to database on selection
- [ ] Thank you message shown after selection
- [ ] Modal closes after feedback

### Do Not Touch
- Success/failure payment flows
- Existing animation patterns (extend, don't replace)
- Razorpay integration

### Implementation Phases

**Phase 7A: Database & API**
1. Add `paymentFeedback` table to `shared/schema.ts`
2. Add feedback API contract to `shared/routes.ts`
3. Add `createPaymentFeedback` to `server/storage.ts`
4. Create `server/feedback.ts` with POST endpoint
5. Register feedback routes in `server/routes.ts`

**Phase 7B: Frontend Hook**
1. Create `client/src/hooks/use-feedback.ts`

**Phase 7C: UI Implementation**
1. Add Cancel button to cancelled state in `PaymentStatusModal.tsx`
2. Implement 3D card flip animation
3. Create feedback cards grid with hover animations
4. Connect to feedback API
5. Add thank you state and auto-close

---

## Landing Page Restructure for 2-Second Clarity

### Story Goal
Restructure the DevFlux landing page so visitors understand exactly what DevFlux does within 2 seconds of landing. Current page requires 8+ sections to scroll through before understanding the product.

---

### Components

#### New Components
| Component | Path | Description |
|-----------|------|-------------|
| `TerminalDemo` | `client/src/components/TerminalDemo.tsx` | Animated terminal showing /quick-fix command in action |
| `CommandsSection` | `client/src/components/sections/CommandsSection.tsx` | 6 commands grid with expandable examples |
| `ProofSection` | `client/src/components/sections/ProofSection.tsx` | Before/After results + FyndFox case study |

#### Modified Components
| Component | Path | Changes |
|-----------|------|---------|
| `Hero.tsx` | `client/src/components/sections/Hero.tsx` | Major restructure - add before/after, terminal, remove stats |
| `Home.tsx` | `client/src/pages/Home.tsx` | Reorder sections, remove Problem/ROICalculator/Guarantee |
| `SetupSection.tsx` | `client/src/components/sections/SetupSection.tsx` | Simplify to 3 steps only |
| `Pricing.tsx` | `client/src/components/sections/Pricing.tsx` | Minor copy updates |

#### Components to Delete
| Component | Path | Reason |
|-----------|------|--------|
| `ROICalculator.tsx` | `client/src/components/sections/ROICalculator.tsx` | Remove calculator entirely |
| `Problem.tsx` | `client/src/components/sections/Problem.tsx` | Remove negative section |
| `HowSimpleIsIt.tsx` | `client/src/components/sections/HowSimpleIsIt.tsx` | Content moved to Hero and CommandsSection |

---

### New Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HERO (Above the fold - CRITICAL)                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Social proof badge: "Used by 90 developers..."          │ │
│ │                                                         │ │
│ │ "Stop Babysitting Your AI. Start Shipping."             │ │
│ │ "6 workflow commands that turn Cursor & Windsurf        │ │
│ │  into senior developers"                                │ │
│ │                                                         │ │
│ │ ┌──────────────────┐  ┌──────────────────┐             │ │
│ │ │ WITHOUT DevFlux  │  │ WITH DevFlux     │             │ │
│ │ │ (red/bad)        │  │ (green/good)     │             │ │
│ │ │ 3 hours wasted   │  │ 15 min done      │             │ │
│ │ └──────────────────┘  └──────────────────┘             │ │
│ │                                                         │ │
│ │ [Terminal Demo: /quick-fix animation]                   │ │
│ │                                                         │ │
│ │ [Get 6 Workflows - ₹899]                                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 6 COMMANDS SECTION                                          │
│ "6 Commands That Actually Work"                             │
│ Grid of 6 expandable command cards                          │
├─────────────────────────────────────────────────────────────┤
│ HOW IT WORKS (3 steps)                                      │
│ 1. Download ZIP  2. Drop in folder  3. Type command, ship   │
│ [Terminal visual]                                           │
├─────────────────────────────────────────────────────────────┤
│ PROOF SECTION                                               │
│ Before/After 90-person team results                         │
│ FyndFox case study                                          │
├─────────────────────────────────────────────────────────────┤
│ PRICING                                                     │
│ Single price card - ₹899 one-time                           │
├─────────────────────────────────────────────────────────────┤
│ FAQ (minimal)                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### Hero Section Design

#### Structure
```tsx
<section className="relative min-h-screen flex items-center">
  {/* Background gradients */}
  
  <div className="container">
    {/* Social proof badge */}
    <Badge>Used by 90 developers shipping 10x faster</Badge>
    
    {/* Headlines */}
    <h1>Stop Babysitting Your AI. Start Shipping.</h1>
    <p>6 workflow commands that turn Cursor & Windsurf into senior developers</p>
    
    {/* Before/After Comparison - MOVED FROM HowSimpleIsIt */}
    <BeforeAfterComparison />
    
    {/* Terminal Demo - NEW */}
    <TerminalDemo />
    
    {/* CTA with price */}
    <BuyNowButton>Get 6 Workflows - ₹899</BuyNowButton>
  </div>
</section>
```

#### Before/After Comparison (Chat Style)
```
┌─────────────────────────┐  ┌─────────────────────────┐
│ WITHOUT DevFlux         │  │ WITH DevFlux            │
│ (red border/bg)         │  │ (green/primary border)  │
├─────────────────────────┤  ├─────────────────────────┤
│ Dev: "Fix payment bug"  │  │ Dev: /complex-issue     │
│ AI: "Check database?"   │  │ + description           │
│ Dev: "That's not it..." │  │                         │
│ AI: "Caching issue?"    │  │ AI: [5-step analysis]   │
│ Dev: "Wrong again"      │  │ "Root cause: line 247"  │
│                         │  │ "Here's fix + tests"    │
├─────────────────────────┤  ├─────────────────────────┤
│ ⏱️ 3 hours of guessing  │  │ ⏱️ 15 minutes           │
│ ❌ Still no root cause  │  │ ✅ Done. Verified.      │
└─────────────────────────┘  └─────────────────────────┘
```

#### Terminal Demo Animation
```tsx
// Auto-playing terminal showing /quick-fix in action
const terminalSequence = [
  { type: "prompt", text: "> " },
  { type: "command", text: "/quick-fix", delay: 100 },
  { type: "newline" },
  { type: "input", text: '"Login button not working after deploy"', delay: 50 },
  { type: "newline" },
  { type: "output", text: "🔍 Analyzing...", delay: 500 },
  { type: "output", text: "✓ Found: onClick handler missing in Button.tsx:42", delay: 800 },
  { type: "output", text: "✓ Fix applied. Tests passing.", delay: 500 },
  { type: "output", text: "⏱️ Total: 2 minutes", delay: 300 },
];
```

---

### Commands Section Design

#### 6 Commands Grid
```tsx
const commands = [
  {
    command: "/quick-fix",
    title: "Quick Fix",
    oneLiner: "Known bugs → 15 min instead of 2 hours",
    timeSaved: "Save 1.75 hours per bug",
    example: "Login button broken after deploy",
    color: "yellow"
  },
  {
    command: "/complex-issue",
    title: "Complex Issues", 
    oneLiner: "Mystery bugs → 1 day instead of 1 week",
    timeSaved: "Save 4 senior dev days",
    example: "Payment fails randomly, 1 in 20 transactions",
    color: "blue"
  },
  {
    command: "/story",
    title: "Story Implementation",
    oneLiner: "New features → 1 day instead of 3 days",
    timeSaved: "Save 2 days, better quality",
    example: "Add user authentication with OAuth",
    color: "purple"
  },
  {
    command: "/refactor",
    title: "Big Refactors",
    oneLiner: "10+ file changes → 2 days instead of 5",
    timeSaved: "Save 3 days, less risk",
    example: "Migrate from REST to GraphQL",
    color: "orange"
  },
  {
    command: "/tests",
    title: "Test Coverage",
    oneLiner: "Full coverage → 45 min instead of 4 hours",
    timeSaved: "Save 3.25 hours",
    example: "Write tests for payment module",
    color: "green"
  },
  {
    command: "/upgrade",
    title: "Version Upgrades",
    oneLiner: "Dependencies → 3 hours instead of 2 days",
    timeSaved: "Save 1.5 days",
    example: "Upgrade React 17 to React 18",
    color: "red"
  }
];
```

#### Expandable Card Design
```
┌─────────────────────────────────────┐
│ /quick-fix                    [+]   │
│ Known bugs → 15 min instead of 2 hr │
└─────────────────────────────────────┘
         ↓ (on click/expand)
┌─────────────────────────────────────┐
│ /quick-fix                    [-]   │
│ Known bugs → 15 min instead of 2 hr │
├─────────────────────────────────────┤
│ Example:                            │
│ "Login button broken after deploy"  │
│                                     │
│ What happens:                       │
│ • AI gathers context automatically  │
│ • Finds root cause with evidence    │
│ • Proposes minimal fix              │
│ • Generates tests                   │
└─────────────────────────────────────┘
```

---

### Definition of Done
- [ ] Hero shows before/after comparison above the fold
- [ ] Terminal demo animation plays automatically
- [ ] CTA shows price: "Get 6 Workflows - ₹899"
- [ ] Social proof updated: "Used by 90 developers shipping 10x faster"
- [ ] 6 Commands section with expandable cards
- [ ] How It Works simplified to 3 steps
- [ ] Proof section with 90-person team results + FyndFox
- [ ] ROICalculator removed
- [ ] Problem section removed
- [ ] Guarantee section removed
- [ ] Mobile responsive (before/after stacks vertically)
- [ ] Red/green color coding consistent

---

### Decisions Log
| Decision | Rationale |
|----------|-----------|
| Move before/after to hero | Most powerful asset, needs to be above fold |
| Create terminal demo | Shows product in action, removes doubt |
| Show price in CTA | Filters serious buyers, reduces friction |
| Remove calculator | Too complex, buried too deep |
| Remove problem section | Negative, makes people read too much |
| 6 sections total | Simplified structure for clarity |

---

### Do Not Touch List
- Payment/Razorpay integration (out of scope)
- Backend API routes
- Database schema
- PaymentStatusModal
- BuyNowButton payment logic

---

### Rollback Points
1. **After Hero restructure**: Can revert Hero.tsx
2. **After new sections**: Can revert CommandsSection, ProofSection
3. **After Home.tsx changes**: Can restore original section order
4. **After deletions**: Git history has Problem.tsx, ROICalculator.tsx

---

### Implementation Phases

**Phase 8A: Create New Components**
1. Create `TerminalDemo.tsx` - animated terminal component
2. Create `CommandsSection.tsx` - 6 commands grid with expandable cards
3. Create `ProofSection.tsx` - before/after results + FyndFox

**Phase 8B: Restructure Hero**
1. Remove stats cards from Hero
2. Add before/after comparison (from HowSimpleIsIt)
3. Add TerminalDemo component
4. Update copy (subheadline, social proof, CTA)

**Phase 8C: Update Home.tsx**
1. Remove Problem section import/usage
2. Remove ROICalculator import/usage
3. Remove Guarantee section
4. Remove inline Comparison section (moved to Hero)
5. Add CommandsSection
6. Add ProofSection
7. Reorder: Hero → Commands → SetupSection → Proof → Pricing → FAQ

**Phase 8D: Simplify SetupSection**
1. Keep only 3 steps
2. Keep terminal visual
3. Remove extra content

**Phase 8E: Cleanup**
1. Delete ROICalculator.tsx
2. Delete Problem.tsx
3. Delete or archive HowSimpleIsIt.tsx
4. Update navigation links
