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
