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
