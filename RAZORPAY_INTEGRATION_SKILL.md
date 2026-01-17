# RAZORPAY PAYMENT GATEWAY INTEGRATION SKILL

> **Purpose**: This skill enables AI assistants to integrate Razorpay payment gateway into web applications. Follow this guide sequentially for complete implementation.

---

## TABLE OF CONTENTS

1. [Prerequisites](#1-prerequisites)
2. [Architecture Overview](#2-architecture-overview)
3. [Backend Setup (Node.js)](#3-backend-setup-nodejs)
4. [Frontend Integration](#4-frontend-integration)
5. [Payment Signature Verification](#5-payment-signature-verification)
6. [Webhook Integration](#6-webhook-integration)
7. [Testing](#7-testing)
8. [Go-Live Checklist](#8-go-live-checklist)
9. [Error Handling](#9-error-handling)
10. [Common Pitfalls & Best Practices](#10-common-pitfalls--best-practices)

---

## 1. PREREQUISITES

### Required Before Integration

```yaml
ACCOUNTS:
  - Razorpay merchant account: https://dashboard.razorpay.com/signup
  - KYC completion (for live mode)

API_KEYS:
  location: Dashboard → Account & Settings → API Keys
  test_keys: Generate from Test Mode
  live_keys: Generate from Live Mode (requires KYC)
  
KEY_FORMAT:
  key_id: "rzp_test_xxxxxxxxxxxx" or "rzp_live_xxxxxxxxxxxx"
  key_secret: "xxxxxxxxxxxxxxxxxxxx" (NEVER expose to frontend)

IMPORTANT_NOTES:
  - Test keys start with "rzp_test_"
  - Live keys start with "rzp_live_"
  - Key secret is shown ONLY ONCE - save it immediately
  - Customer payment info should NEVER reach your servers (PCI-DSS compliance)
```

### Dependencies

```bash
# Node.js Backend
npm install razorpay express crypto dotenv

# Python Backend (alternative)
pip install razorpay flask

# Frontend
# No npm install needed - use CDN script
```

---

## 2. ARCHITECTURE OVERVIEW

### Payment Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         RAZORPAY PAYMENT FLOW                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [1] Customer clicks "Pay"                                                   │
│           │                                                                  │
│           ▼                                                                  │
│  [2] Frontend → Backend: Request to create order                             │
│           │                                                                  │
│           ▼                                                                  │
│  [3] Backend → Razorpay API: Create Order (amount, currency, receipt)        │
│           │                                                                  │
│           ▼                                                                  │
│  [4] Razorpay → Backend: Returns order_id                                    │
│           │                                                                  │
│           ▼                                                                  │
│  [5] Backend → Frontend: Send order_id + key_id                              │
│           │                                                                  │
│           ▼                                                                  │
│  [6] Frontend: Open Razorpay Checkout with order_id                          │
│           │                                                                  │
│           ▼                                                                  │
│  [7] Customer completes payment in Razorpay modal                            │
│           │                                                                  │
│           ▼                                                                  │
│  [8] Razorpay → Frontend: Returns razorpay_payment_id,                       │
│                           razorpay_order_id, razorpay_signature              │
│           │                                                                  │
│           ▼                                                                  │
│  [9] Frontend → Backend: Send payment details for verification               │
│           │                                                                  │
│           ▼                                                                  │
│  [10] Backend: Verify signature using HMAC SHA256                            │
│           │                                                                  │
│           ▼                                                                  │
│  [11] Backend: Update database, fulfill order                                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Key Concepts

```yaml
ORDER:
  description: "Server-side entity created before payment"
  purpose: "Links payment to your system, prevents tampering"
  required: true
  note: "Payments without order_id are auto-refunded"

PAYMENT:
  description: "Customer's actual payment attempt"
  states: [created, authorized, captured, refunded, failed]
  
SIGNATURE:
  description: "HMAC SHA256 hash for verification"
  purpose: "Confirms payment is from authentic Razorpay source"
  
CAPTURE:
  description: "Process to settle funds to your account"
  auto_capture: "Can be enabled in Dashboard settings"
  manual_capture: "Payment must be captured via API within 5 days"
```

---

## 3. BACKEND SETUP (NODE.JS)

### Step 3.1: Environment Configuration

```bash
# .env file
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
PORT=3000
```

### Step 3.2: Initialize Razorpay Instance

```javascript
// config/razorpay.js
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;
```

### Step 3.3: Create Order Endpoint

```javascript
// routes/payment.js
const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

/**
 * CREATE ORDER
 * POST /api/payment/create-order
 * 
 * Request Body:
 * {
 *   "amount": 50000,        // Amount in PAISE (50000 = ₹500)
 *   "currency": "INR",
 *   "receipt": "order_123", // Your internal order ID
 *   "notes": {}             // Optional metadata
 * }
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body;

    // Validation
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be at least 100 paise (₹1)',
      });
    }

    const options = {
      amount: Math.round(amount), // Amount in smallest currency unit (paise)
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes,
      // payment_capture: 1  // Auto-capture (optional - can also set in Dashboard)
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
      key_id: process.env.RAZORPAY_KEY_ID, // Send key_id to frontend
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      details: error.message,
    });
  }
});

module.exports = router;
```

### Step 3.4: Order Creation - Request/Response Reference

```yaml
CREATE_ORDER_REQUEST:
  endpoint: "POST https://api.razorpay.com/v1/orders"
  authentication: "Basic Auth (key_id:key_secret)"
  
  required_params:
    amount:
      type: integer
      description: "Amount in smallest currency unit"
      example: 50000  # ₹500.00
      note: "For INR, multiply rupees by 100"
      
    currency:
      type: string
      description: "ISO currency code"
      example: "INR"
      length: 3
      
  optional_params:
    receipt:
      type: string
      description: "Your internal order reference"
      max_length: 40
      example: "order_rcptid_11"
      
    notes:
      type: object
      description: "Key-value pairs for additional info"
      max_pairs: 15
      max_key_length: 256
      example:
        shipping_address: "123 Main St"
        customer_id: "cust_456"
        
    partial_payment:
      type: boolean
      description: "Allow partial payments"
      default: false
      
    first_payment_min_amount:
      type: integer
      description: "Minimum first payment if partial_payment is true"
      condition: "Only if partial_payment is true"

CREATE_ORDER_RESPONSE:
  success_example:
    id: "order_DBJOWzybf0sJbb"
    entity: "order"
    amount: 50000
    amount_paid: 0
    amount_due: 50000
    currency: "INR"
    receipt: "receipt#1"
    offer_id: null
    status: "created"
    attempts: 0
    notes: []
    created_at: 1566986570
```

---

## 4. FRONTEND INTEGRATION

### Step 4.1: Include Razorpay Checkout Script

```html
<!-- Add this script in your HTML <head> or before closing </body> -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 4.2: Checkout Implementation (Vanilla JavaScript)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Razorpay Payment</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body>
  <button id="pay-button">Pay ₹500</button>

  <script>
    const payButton = document.getElementById('pay-button');

    payButton.addEventListener('click', async () => {
      try {
        // Step 1: Create order on backend
        const orderResponse = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 50000,  // ₹500 in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
              product: 'Premium Subscription'
            }
          }),
        });

        const orderData = await orderResponse.json();

        if (!orderData.success) {
          throw new Error(orderData.error);
        }

        // Step 2: Configure Razorpay Checkout options
        const options = {
          key: orderData.key_id,                    // Key ID from backend
          amount: orderData.order.amount,           // Amount in paise
          currency: orderData.order.currency,
          name: 'Your Company Name',                // Shown in checkout
          description: 'Payment for Premium Plan',  // Shown in checkout
          image: 'https://yoursite.com/logo.png',   // Company logo URL
          order_id: orderData.order.id,             // Order ID from backend
          
          // Handler function for successful payment
          handler: async function (response) {
            // response contains:
            // - razorpay_payment_id
            // - razorpay_order_id
            // - razorpay_signature
            
            console.log('Payment successful:', response);
            
            // Step 3: Verify payment on backend
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              alert('Payment verified successfully!');
              // Redirect to success page
              window.location.href = '/payment-success';
            } else {
              alert('Payment verification failed!');
            }
          },
          
          // Prefill customer details (recommended for better conversion)
          prefill: {
            name: 'John Doe',
            email: 'john@example.com',
            contact: '+919876543210',  // Format: +{country_code}{number}
          },
          
          // Additional notes
          notes: {
            address: 'Customer address',
          },
          
          // Theme customization
          theme: {
            color: '#3399cc',  // Primary color
          },
          
          // Modal configuration
          modal: {
            ondismiss: function () {
              console.log('Checkout form closed by user');
            },
            escape: true,       // Allow ESC key to close
            animation: true,    // Enable animations
          },
          
          // Retry configuration
          retry: {
            enabled: true,
            max_count: 4,  // Max retry attempts (recommended: 4)
          },
        };

        // Step 4: Initialize and open Razorpay Checkout
        const rzp = new Razorpay(options);
        
        // Handle payment failure
        rzp.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          alert(`Payment failed: ${response.error.description}`);
          // response.error contains:
          // - code
          // - description
          // - source
          // - step
          // - reason
          // - metadata.order_id
          // - metadata.payment_id
        });

        rzp.open();

      } catch (error) {
        console.error('Payment initialization failed:', error);
        alert('Could not initiate payment. Please try again.');
      }
    });
  </script>
</body>
</html>
```

### Step 4.3: React Implementation

```jsx
// components/RazorpayPayment.jsx
import React, { useState } from 'react';

const RazorpayPayment = ({ amount, productName, customerDetails }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // Configure options
      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Your Company',
        description: productName,
        order_id: data.order.id,
        handler: async (response) => {
          // Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Handle success (redirect, update state, etc.)
            console.log('Payment successful!');
          } else {
            throw new Error('Verification failed');
          }
        },
        prefill: {
          name: customerDetails?.name || '',
          email: customerDetails?.email || '',
          contact: customerDetails?.phone || '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment could not be initiated');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="pay-button"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayPayment;
```

### Step 4.4: Checkout Options Reference

```yaml
CHECKOUT_OPTIONS:
  required:
    key:
      type: string
      description: "API Key ID (starts with rzp_test_ or rzp_live_)"
      
    amount:
      type: integer
      description: "Amount in smallest currency unit (paise for INR)"
      
    order_id:
      type: string
      description: "Order ID from create order API"
      
  recommended:
    currency:
      type: string
      default: "INR"
      
    name:
      type: string
      description: "Business name shown on checkout"
      max_length: 30
      
    description:
      type: string
      description: "Purchase description"
      max_length: 255
      
    image:
      type: string
      description: "Logo URL or base64 string"
      
    prefill:
      name:
        type: string
        description: "Customer name"
      email:
        type: string
        description: "Customer email"
      contact:
        type: string
        description: "Customer phone with country code"
        format: "+919876543210"
        
    handler:
      type: function
      description: "Callback for successful payment"
      receives: "{ razorpay_payment_id, razorpay_order_id, razorpay_signature }"
      
  optional:
    callback_url:
      type: string
      description: "URL for server-side redirect (alternative to handler)"
      note: "If used, set redirect: true"
      
    redirect:
      type: boolean
      default: false
      description: "Enable redirect to callback_url"
      
    notes:
      type: object
      description: "Key-value pairs (max 15, 256 chars each)"
      
    theme:
      color:
        type: string
        description: "Primary theme color (hex)"
        example: "#3399cc"
        
    modal:
      escape:
        type: boolean
        default: true
        description: "Allow ESC to close modal"
      ondismiss:
        type: function
        description: "Callback when modal is closed"
      animation:
        type: boolean
        default: true
        
    retry:
      enabled:
        type: boolean
        default: true
      max_count:
        type: integer
        default: 4
        recommendation: "Set to 4 to prevent infinite loops"
```

---

## 5. PAYMENT SIGNATURE VERIFICATION

### Step 5.1: Verification Endpoint (CRITICAL - NEVER SKIP)

```javascript
// routes/payment.js (continued)
const crypto = require('crypto');

/**
 * VERIFY PAYMENT SIGNATURE
 * POST /api/payment/verify
 * 
 * Request Body:
 * {
 *   "razorpay_payment_id": "pay_xxxxxxxxxxxx",
 *   "razorpay_order_id": "order_xxxxxxxxxxxx",
 *   "razorpay_signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
 * }
 */
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // Validation
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification parameters',
      });
    }

    // Generate signature for verification
    // Format: order_id|payment_id
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified - UPDATE YOUR DATABASE HERE
      // Example: Mark order as paid, update inventory, send confirmation email
      
      /*
        await Order.updateOne(
          { razorpay_order_id: razorpay_order_id },
          { 
            status: 'paid',
            razorpay_payment_id: razorpay_payment_id,
            paid_at: new Date()
          }
        );
      */

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      });

    } else {
      // Signature mismatch - possible tampering
      console.error('Signature verification failed:', {
        expected: expectedSignature,
        received: razorpay_signature,
      });

      res.status(400).json({
        success: false,
        error: 'Payment verification failed - signature mismatch',
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      details: error.message,
    });
  }
});
```

### Step 5.2: Using Razorpay SDK for Verification (Alternative)

```javascript
// Using Razorpay Node SDK's built-in utility
const Razorpay = require('razorpay');

router.post('/verify-sdk', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    const isValid = Razorpay.validateWebhookSignature(
      razorpay_order_id + '|' + razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (isValid) {
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Step 5.3: Signature Verification Logic

```yaml
SIGNATURE_VERIFICATION:
  algorithm: "HMAC SHA256"
  
  for_payments:
    input_string: "{order_id}|{payment_id}"
    key: "RAZORPAY_KEY_SECRET"
    compare_with: "razorpay_signature from checkout response"
    
  for_subscriptions:
    input_string: "{subscription_id}|{payment_id}"
    key: "RAZORPAY_KEY_SECRET"
    compare_with: "razorpay_signature from checkout response"
    
  for_webhooks:
    input_string: "raw webhook request body (unparsed)"
    key: "WEBHOOK_SECRET (from Dashboard)"
    compare_with: "x-razorpay-signature header"

CRITICAL_NOTES:
  - Never skip signature verification
  - Use constant-time comparison to prevent timing attacks
  - Log failed verifications for security monitoring
  - Never expose key_secret to frontend
```

---

## 6. WEBHOOK INTEGRATION

### Step 6.1: Webhook Setup in Dashboard

```yaml
WEBHOOK_SETUP:
  location: "Dashboard → Account & Settings → Webhooks"
  
  steps:
    1. Click "Add New Webhook"
    2. Enter your webhook URL (must be HTTPS in production)
    3. Generate and copy the Webhook Secret
    4. Select events to subscribe to
    5. Save configuration

  recommended_events:
    - payment.authorized    # Payment authorized by bank
    - payment.captured      # Payment captured (funds will settle)
    - payment.failed        # Payment failed
    - order.paid           # Order marked as paid
    - refund.created       # Refund initiated
    - refund.processed     # Refund completed

  webhook_url_requirements:
    - Must be publicly accessible
    - Must use HTTPS (in production)
    - Must respond with 2xx status within 5 seconds
    - For local testing: Use ngrok or similar tunnel
```

### Step 6.2: Webhook Handler

```javascript
// routes/webhook.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

/**
 * RAZORPAY WEBHOOK HANDLER
 * POST /api/webhook/razorpay
 * 
 * IMPORTANT: Use raw body parser for this route
 */

// Middleware to get raw body for signature verification
router.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

router.post('/razorpay', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.rawBody)  // MUST use raw body, not parsed JSON
      .digest('hex');

    if (expectedSignature !== receivedSignature) {
      console.error('Webhook signature verification failed');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Signature verified - process the event
    const event = req.body.event;
    const payload = req.body.payload;

    // Handle duplicate events (idempotency)
    const eventId = req.headers['x-razorpay-event-id'];
    // Check if eventId already processed in your database
    // If yes, return 200 OK to acknowledge receipt

    console.log(`Webhook received: ${event}`, eventId);

    switch (event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(payload.payment.entity);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;

      case 'order.paid':
        await handleOrderPaid(payload.order.entity, payload.payment.entity);
        break;

      case 'refund.created':
        await handleRefundCreated(payload.refund.entity);
        break;

      case 'refund.processed':
        await handleRefundProcessed(payload.refund.entity);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ status: 'ok' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to prevent retries for processing errors
    // Log the error for investigation
    res.status(200).json({ status: 'error logged' });
  }
});

// Event Handlers
async function handlePaymentAuthorized(payment) {
  console.log('Payment authorized:', payment.id);
  // Payment is authorized but not yet captured
  // If auto-capture is disabled, capture manually here or via Dashboard
  
  /*
    await Order.updateOne(
      { razorpay_order_id: payment.order_id },
      { status: 'authorized', razorpay_payment_id: payment.id }
    );
  */
}

async function handlePaymentCaptured(payment) {
  console.log('Payment captured:', payment.id);
  // Payment captured - funds will be settled
  // Fulfill the order, send confirmation email, etc.
  
  /*
    await Order.updateOne(
      { razorpay_order_id: payment.order_id },
      { 
        status: 'paid',
        razorpay_payment_id: payment.id,
        amount_paid: payment.amount,
        paid_at: new Date(payment.captured_at * 1000)
      }
    );
    
    await sendOrderConfirmationEmail(payment.order_id);
  */
}

async function handlePaymentFailed(payment) {
  console.log('Payment failed:', payment.id, payment.error_description);
  // Log the failure, notify user, etc.
  
  /*
    await Order.updateOne(
      { razorpay_order_id: payment.order_id },
      { 
        status: 'failed',
        failure_reason: payment.error_description
      }
    );
  */
}

async function handleOrderPaid(order, payment) {
  console.log('Order paid:', order.id);
  // Order is fully paid
}

async function handleRefundCreated(refund) {
  console.log('Refund initiated:', refund.id);
}

async function handleRefundProcessed(refund) {
  console.log('Refund processed:', refund.id);
}

module.exports = router;
```

### Step 6.3: Webhook Payload Examples

```json
// payment.captured webhook payload
{
  "entity": "event",
  "account_id": "acc_xxxxxxxxxxxxx",
  "event": "payment.captured",
  "contains": ["payment"],
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxxxxxxxxxxxx",
        "entity": "payment",
        "amount": 50000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_xxxxxxxxxxxxx",
        "method": "upi",
        "description": "Payment for Order #123",
        "email": "customer@example.com",
        "contact": "+919876543210",
        "fee": 1180,
        "tax": 180,
        "captured": true,
        "captured_at": 1234567890,
        "created_at": 1234567800
      }
    }
  },
  "created_at": 1234567890
}
```

---

## 7. TESTING

### Step 7.1: Test Mode Configuration

```yaml
TEST_MODE_SETUP:
  dashboard: "Ensure 'Test Mode' is selected in Dashboard"
  api_keys: "Use keys starting with rzp_test_"
  
TEST_CARDS:
  successful_payment:
    card_number: "4111 1111 1111 1111"
    expiry: "Any future date (MM/YY)"
    cvv: "Any 3 digits (e.g., 123)"
    name: "Any name"
    
  failed_payment:
    card_number: "4111 1111 1111 1234"
    # This card will always fail
    
TEST_UPI:
  success: "success@razorpay"
  failure: "failure@razorpay"
  
TEST_NETBANKING:
  # Select any bank, use any credentials
  # OTP: Enter any 4+ digit number
  
TEST_WALLET:
  # Select any wallet
  # Enter any phone number and OTP
  
IMPORTANT_NOTES:
  - No real money is deducted in test mode
  - Test transactions appear in Dashboard under Test Mode
  - OTP verification may be required to simulate live experience
```

### Step 7.2: Local Testing with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the HTTPS URL for:
# - Webhook URL in Razorpay Dashboard
# - callback_url in checkout options (if using)

# Example ngrok output:
# Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

### Step 7.3: Testing Checklist

```yaml
TESTING_CHECKLIST:
  order_creation:
    - [ ] Order created successfully
    - [ ] Order ID returned to frontend
    - [ ] Order visible in Dashboard
    
  checkout:
    - [ ] Checkout modal opens
    - [ ] Amount displayed correctly
    - [ ] Business name and logo shown
    - [ ] Customer details pre-filled
    
  payment_flow:
    - [ ] Test card payment succeeds
    - [ ] Test UPI payment succeeds
    - [ ] Payment failure handled gracefully
    - [ ] Modal close handled
    
  verification:
    - [ ] Signature verified correctly
    - [ ] Database updated on success
    - [ ] Invalid signature rejected
    
  webhooks:
    - [ ] Webhook received
    - [ ] Signature verified
    - [ ] Event processed correctly
    - [ ] Duplicate events handled (idempotency)
    
  edge_cases:
    - [ ] Network timeout during payment
    - [ ] Browser closed during payment
    - [ ] Multiple payment attempts
    - [ ] Minimum amount (₹1) payment
```

---

## 8. GO-LIVE CHECKLIST

### Step 8.1: Pre-Launch Requirements

```yaml
MANDATORY_STEPS:
  1_account_activation:
    - Complete KYC on Razorpay Dashboard
    - Business verification approved
    - Bank account added and verified
    
  2_api_keys:
    - Generate LIVE MODE API keys
    - Replace test keys with live keys in production
    - Secure storage of live key_secret
    
  3_code_changes:
    action: "Replace test credentials with live credentials"
    files_to_update:
      - .env.production
      - Backend configuration
    verification: "Ensure no test keys in production code"
    
  4_webhooks:
    - Set up webhooks in LIVE MODE
    - Generate new webhook secret for live
    - Update webhook URL to production endpoint
    
  5_https:
    - Production server must use HTTPS
    - Checkout requires HTTPS in live mode
    
  6_auto_capture:
    location: "Dashboard → Settings → Payment Capture"
    options:
      - "Automatic" (recommended for most businesses)
      - "Manual" (if you need to verify before capture)
    note: "Uncaptured payments are auto-refunded after 5 days"
```

### Step 8.2: Security Checklist

```yaml
SECURITY_REQUIREMENTS:
  key_management:
    - [ ] key_secret stored in environment variables only
    - [ ] key_secret never committed to version control
    - [ ] key_secret never exposed to frontend
    
  signature_verification:
    - [ ] All payments verified before fulfillment
    - [ ] Webhook signatures always verified
    - [ ] Failed verifications logged and monitored
    
  https:
    - [ ] All API endpoints use HTTPS
    - [ ] Checkout loaded over HTTPS
    
  pci_compliance:
    - [ ] Card data never touches your servers
    - [ ] Using Razorpay Checkout (handles PCI compliance)
    
  error_handling:
    - [ ] No sensitive data in error messages
    - [ ] Errors logged securely
```

### Step 8.3: Environment Variables for Production

```bash
# .env.production
NODE_ENV=production
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx
```

---

## 9. ERROR HANDLING

### Step 9.1: Common Error Codes

```yaml
ERROR_CODES:
  BAD_REQUEST_ERROR:
    code: "BAD_REQUEST_ERROR"
    causes:
      - Invalid parameters
      - Missing required fields
      - Amount below minimum
    resolution: "Check request parameters"
    
  GATEWAY_ERROR:
    code: "GATEWAY_ERROR"
    causes:
      - Bank/gateway unavailable
      - Network issues
    resolution: "Retry payment or try different method"
    
  SERVER_ERROR:
    code: "SERVER_ERROR"
    causes:
      - Razorpay service issue
    resolution: "Wait and retry"
    
  PAYMENT_ERROR:
    code: "PAYMENT_ERROR"
    causes:
      - Card declined
      - Insufficient funds
      - Authentication failed
    resolution: "User should try different payment method"

CHECKOUT_ERRORS:
  error_codes:
    - BAD_REQUEST_ERROR
    - GATEWAY_ERROR
    - SERVER_ERROR
    
  error_object_structure:
    code: "Error code"
    description: "Human-readable description"
    source: "customer | bank | business"
    step: "payment_authentication | payment_authorization"
    reason: "payment_failed | payment_cancelled"
    metadata:
      order_id: "order_xxxxx"
      payment_id: "pay_xxxxx"
```

### Step 9.2: Error Handling Implementation

```javascript
// Frontend error handling
rzp.on('payment.failed', function (response) {
  const error = response.error;
  
  console.error('Payment Failed:', {
    code: error.code,
    description: error.description,
    source: error.source,
    step: error.step,
    reason: error.reason,
    orderId: error.metadata?.order_id,
    paymentId: error.metadata?.payment_id,
  });

  // User-friendly error messages
  let userMessage = 'Payment failed. ';
  
  switch (error.reason) {
    case 'payment_cancelled':
      userMessage += 'You cancelled the payment.';
      break;
    case 'payment_failed':
      if (error.source === 'customer') {
        userMessage += 'Please check your payment details and try again.';
      } else if (error.source === 'bank') {
        userMessage += 'Your bank declined the payment. Please try a different method.';
      } else {
        userMessage += 'Please try again or use a different payment method.';
      }
      break;
    default:
      userMessage += 'Please try again.';
  }

  // Show error to user
  showErrorMessage(userMessage);
  
  // Log for debugging (send to your server)
  logPaymentError(error);
});

// Backend error handling
router.post('/create-order', async (req, res) => {
  try {
    // ... order creation logic
  } catch (error) {
    // Check if it's a Razorpay error
    if (error.error) {
      return res.status(400).json({
        success: false,
        error: error.error.description,
        code: error.error.code,
      });
    }
    
    // Generic error
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    });
  }
});
```

---

## 10. COMMON PITFALLS & BEST PRACTICES

### Pitfalls to Avoid

```yaml
COMMON_MISTAKES:
  1_amount_unit:
    mistake: "Passing amount in rupees instead of paise"
    example_wrong: "amount: 500  // Means ₹5, not ₹500"
    example_correct: "amount: 50000  // ₹500 in paise"
    
  2_key_exposure:
    mistake: "Exposing key_secret to frontend"
    impact: "Security vulnerability - anyone can create orders"
    solution: "Keep key_secret server-side only"
    
  3_skip_verification:
    mistake: "Fulfilling orders without signature verification"
    impact: "Vulnerable to fake payment notifications"
    solution: "ALWAYS verify signature before fulfillment"
    
  4_webhook_body_parsing:
    mistake: "Using parsed JSON body for webhook signature"
    impact: "Signature verification always fails"
    solution: "Use raw request body for HMAC calculation"
    
  5_order_id_reuse:
    mistake: "Not creating new order for retry attempts"
    impact: "Payment may fail or be linked to wrong order"
    solution: "Create fresh order for each payment attempt"
    
  6_missing_error_handling:
    mistake: "Not handling payment.failed event"
    impact: "Poor user experience on failures"
    solution: "Always implement comprehensive error handling"
    
  7_test_keys_in_production:
    mistake: "Deploying with test API keys"
    impact: "No real payments processed"
    solution: "Verify live keys before deployment"
```

### Best Practices

```yaml
BEST_PRACTICES:
  security:
    - Store credentials in environment variables
    - Use HTTPS everywhere in production
    - Verify all payment signatures
    - Implement webhook signature verification
    - Log failed verification attempts
    
  reliability:
    - Implement webhook handlers as primary notification method
    - Use handler function + webhooks for redundancy
    - Handle duplicate webhook events (idempotency)
    - Implement retry logic for failed API calls
    
  user_experience:
    - Pre-fill customer details in checkout
    - Show clear error messages
    - Provide payment retry option
    - Send payment confirmation immediately
    
  conversion_optimization:
    - Always prefill phone number (improves UPI success)
    - Set retry.max_count to 4
    - Keep checkout description clear and concise
    - Use recognizable business name and logo
    
  monitoring:
    - Log all payment events
    - Set up alerts for failed payments spike
    - Monitor webhook delivery
    - Track conversion rates by payment method
    
  database:
    - Store order_id before initiating checkout
    - Update order status at each payment stage
    - Keep audit trail of all status changes
    - Store payment_id for refund operations
```

---

## QUICK REFERENCE

### API Endpoints

```yaml
RAZORPAY_API_BASE: "https://api.razorpay.com/v1"

ENDPOINTS:
  orders:
    create: "POST /orders"
    fetch: "GET /orders/{order_id}"
    fetch_payments: "GET /orders/{order_id}/payments"
    
  payments:
    fetch: "GET /payments/{payment_id}"
    capture: "POST /payments/{payment_id}/capture"
    refund: "POST /payments/{payment_id}/refund"
    
  refunds:
    create: "POST /refunds"
    fetch: "GET /refunds/{refund_id}"
```

### Minimum Implementation Files

```
project/
├── .env
├── config/
│   └── razorpay.js          # Razorpay instance
├── routes/
│   ├── payment.js           # Order creation & verification
│   └── webhook.js           # Webhook handler
├── public/
│   └── index.html           # Frontend with checkout
└── server.js                # Express server
```

### Environment Variables Required

```bash
RAZORPAY_KEY_ID=rzp_test_xxxx       # or rzp_live_xxxx
RAZORPAY_KEY_SECRET=xxxx            # Keep secret!
RAZORPAY_WEBHOOK_SECRET=xxxx        # From Dashboard
```

---

## SUPPORT RESOURCES

```yaml
OFFICIAL_DOCUMENTATION:
  main: "https://razorpay.com/docs/"
  api_reference: "https://razorpay.com/docs/api/"
  webhooks: "https://razorpay.com/docs/webhooks/"
  
SDK_REPOSITORIES:
  nodejs: "https://github.com/razorpay/razorpay-node"
  python: "https://github.com/razorpay/razorpay-python"
  
DASHBOARD:
  url: "https://dashboard.razorpay.com/"
  
SUPPORT:
  email: "support@razorpay.com"
  docs: "https://razorpay.com/docs/payments/payment-gateway/"
```

---

**END OF SKILL DOCUMENT**

*Last Updated: January 2025*
*Version: 1.0*
