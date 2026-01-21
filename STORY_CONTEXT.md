# Story Context: Payment Cancellation Feedback

## Story/Feature
When a user clicks "Buy Now" and then cancels the payment, add a "Cancel" button below the "Try Again" button. When clicked, the card flips to reveal 4 feedback cards asking why the user doesn't want to pay.

## Acceptance Criteria
1. Cancel button appears below "Try Again" in the payment cancelled modal
2. Clicking Cancel triggers a 3D card flip animation
3. Flipped side shows 4 feedback option cards
4. User can select one feedback option
5. Feedback is saved to database with available context (timestamp, user agent, etc.)
6. After selection, show thank you message and close modal

## User Flow
1. User clicks "Buy Now"
2. Razorpay modal opens
3. User dismisses/cancels Razorpay modal
4. "Payment Cancelled" modal appears with:
   - Warning icon
   - "Payment Cancelled" title
   - "Try Again" button (yellow)
   - **NEW: "Cancel" button below**
5. User clicks "Cancel"
6. Card flips with 3D animation
7. 4 feedback cards appear:
   - "Too expensive"
   - "Just browsing"
   - "Need more features"
   - "Will buy later"
8. User clicks one option
9. Feedback saved to DB
10. Thank you message shown briefly
11. Modal closes

## Scope Boundaries
- OUT: Modifying success/failure flows
- OUT: Changing Razorpay integration
- OUT: Email notifications for feedback

## Dependencies
- Existing PaymentStatusModal component
- Drizzle ORM for database
- Framer Motion for animations

## Technical Constraints
- Must work with existing Dialog component from shadcn/ui
- Must follow existing animation patterns (Framer Motion)
- Database must use Drizzle ORM pattern
