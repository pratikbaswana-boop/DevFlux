# CODEBASE_PATTERNS.md

## Reference Feature Analyzed
**AuditModal** - Modal-based form component that triggers on button click, collects user data, and submits to backend API.

## Architecture Pattern

### Frontend (React + TypeScript)
- **Component Structure**: Functional components with hooks
- **State Management**: React Query (`@tanstack/react-query`) for server state
- **Form Handling**: `react-hook-form` with `zod` validation via `@hookform/resolvers`
- **UI Components**: shadcn/ui components (`@/components/ui/*`)
- **Styling**: TailwindCSS with custom theme colors (primary, secondary)
- **Animations**: Framer Motion for transitions

### Backend (Express + TypeScript)
- **API Structure**: Routes defined in `server/routes.ts`
- **Shared Types**: Zod schemas in `shared/schema.ts`, API contracts in `shared/routes.ts`
- **Validation**: Zod for input validation on both client and server

### Button Locations to Replace
1. **Hero.tsx** (line 39-43): "Book Free Audit" button wrapped in `<AuditModal>`
2. **Hero.tsx** (line 44-48): "See How It Works" button (keep as is)
3. **Home.tsx** (line 26-30): Nav "Book Audit" button wrapped in `<AuditModal>`
4. **Home.tsx** (line 133-137): Final CTA "Book Your Audit Now" wrapped in `<AuditModal>`
5. **Pricing.tsx** (line 53-57): "Get Started" button wrapped in `<AuditModal>`

## Naming Conventions
- **Components**: PascalCase (e.g., `RazorpayPayment`, `BuyNowButton`)
- **Files**: PascalCase for components (e.g., `BuyNowButton.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePayment`)
- **API Routes**: kebab-case paths (e.g., `/api/payment/create-order`)
- **CSS Classes**: TailwindCSS utility classes

## Error Handling & Logging Patterns
- **Frontend**: Try-catch with user-friendly alerts, mutation error states
- **Backend**: Try-catch with Zod error handling, 400/500 status codes
- **Logging**: `console.error` for errors, `console.log` for debug

## Existing Utilities to Reuse
- `@/components/ui/button` - Button component
- `@/components/ui/dialog` - Modal dialogs
- `@/hooks/use-audit` - Pattern for creating mutation hooks
- `@shared/routes` - API route definitions pattern
- `@shared/schema` - Zod schema definitions

## Key Dependencies
- No Razorpay SDK in package.json - needs to be added
- Express backend ready for new routes
- Zod for validation
