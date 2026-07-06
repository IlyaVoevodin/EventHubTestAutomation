# EventHub Test Plan

## Application Overview

Test plan for EventHub (https://eventhub.rahulshettyacademy.com) covering authentication, event browsing, registration, profile, and security using provided credentials.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Login - Happy Path

**File:** `specs/auth/login-happy.spec.md`

**Steps:**
  1. Assumption: Start with a fresh browser and no active session. Navigate to https://eventhub.rahulshettyacademy.com
    - expect: Homepage loads successfully
  2. Click the 'Login' or 'Sign In' link/button in header
    - expect: Login page or modal appears with email and password fields
  3. Enter email 'voevodinilya12@gmail.com' and password 'S1ngleForev*_', then submit
    - expect: User is authenticated and redirected to the dashboard or events list
    - expect: User's name or avatar appears in the header
    - expect: A persistent session cookie or localStorage token is set (if inspectable)
  4. Open a protected page (e.g., 'My Registrations' or profile)
    - expect: Protected page loads without redirect to login

#### 1.2. Login - Invalid Password

**File:** `specs/auth/login-invalid.spec.md`

**Steps:**
  1. Assumption: Fresh browser, navigate to Login page
    - expect: Login page visible
  2. Enter email 'voevodinilya12@gmail.com' and an incorrect password 'wrongPass123', submit
    - expect: Login fails and a clear error message is displayed (e.g., 'Invalid credentials' or 'Incorrect password')
    - expect: No session cookie or token is created

#### 1.3. Password Reset Flow

**File:** `specs/auth/password-reset.spec.md`

**Steps:**
  1. Navigate to Login page and click 'Forgot Password' or 'Reset Password' link
    - expect: Password reset form appears
  2. Enter 'voevodinilya12@gmail.com' and submit the reset request
    - expect: Confirmation message displayed indicating an email was sent or further instructions provided
    - expect: No sensitive information shown in UI

### 2. Event Browsing

**Seed:** `tests/seed.spec.ts`

#### 2.1. View Upcoming Events

**File:** `specs/browsing/view-events.spec.md`

**Steps:**
  1. Assumption: Start fresh. Navigate to homepage
    - expect: Upcoming events list/grid is visible with event cards
  2. Click an event card to open event details
    - expect: Event details page/modal shows title, date, time, location, description, and a 'Register' or 'Buy Ticket' CTA

#### 2.2. Search and Filter Events

**File:** `specs/browsing/search-filter.spec.md`

**Steps:**
  1. Navigate to homepage or events listing
    - expect: Search bar and filter controls (category, date, location) are present
  2. Enter a keyword (e.g., 'SDET' or 'Automation') and apply filters (date range, category)
    - expect: Results update to match search and filters
    - expect: No irrelevant events shown
    - expect: If no results, a helpful 'no events found' message appears

### 3. Registration & Tickets

**Seed:** `tests/seed.spec.ts`

#### 3.1. Register for a Free Event (Happy Path)

**File:** `specs/registration/register-free.spec.md`

**Steps:**
  1. Assumption: User is logged in as 'voevodinilya12@gmail.com' (include login steps if necessary)
    - expect: User is authenticated
  2. Navigate to an event detail page that is free and click 'Register' or 'Reserve Spot'
    - expect: Registration confirmation modal or page appears
    - expect: User sees a success message and a ticket/registration record in 'My Registrations' or orders
  3. Open 'My Registrations' or profile -> registrations
    - expect: New registration is listed with correct event name and date

#### 3.2. Attempt Duplicate Registration (Negative)

**File:** `specs/registration/duplicate.spec.md`

**Steps:**
  1. Assumption: User already registered for a specific event
    - expect: Registration exists in account
  2. Attempt to register again for the same event
    - expect: System prevents duplicate registration with a clear message OR creates idempotent result without duplicate entries
    - expect: No payment or duplicate ticket issued

#### 3.3. Register for Paid Event (Checkout)

**File:** `specs/registration/paid.spec.md`

**Steps:**
  1. Assumption: Logged in user. Navigate to a paid event's detail page
    - expect: Price and purchase CTA visible
  2. Click 'Buy' or 'Register' and proceed to checkout
    - expect: Checkout/payment page appears with order summary
    - expect: Form accepts payment test data (or mock) and submission returns success or failure message depending on test setup
  3. Complete (or mock-complete) payment flow
    - expect: Order confirmation page and receipt visible
    - expect: Order appears in 'My Orders' or 'My Registrations'

### 4. Profile & Account

**Seed:** `tests/seed.spec.ts`

#### 4.1. Edit Profile Details

**File:** `specs/account/edit-profile.spec.md`

**Steps:**
  1. Assumption: User logged in
    - expect: Profile page accessible
  2. Navigate to profile/settings, update display name or phone, and save changes
    - expect: Confirmation message shown
    - expect: Changes persist after page refresh and on subsequent logins

#### 4.2. Logout and Access Control

**File:** `specs/account/logout.spec.md`

**Steps:**
  1. Assumption: User logged in
    - expect: User session active
  2. Click 'Logout' from header or account menu
    - expect: User is redirected to homepage or login page
    - expect: Protected pages now redirect to login when accessed

### 5. Security & Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 5.1. Session Timeout Handling

**File:** `specs/security/session-timeout.spec.md`

**Steps:**
  1. Assumption: User logged in
    - expect: User session active
  2. Simulate user idle time beyond session TTL (or manually invalidate session token) and then navigate to a protected page
    - expect: User is redirected to login with an explanatory message or forced re-authentication
    - expect: No sensitive data remains visible in UI

#### 5.2. Input Validation and Injection Protection

**File:** `specs/security/input-validation.spec.md`

**Steps:**
  1. Navigate to search, event creation (if available), or any input field
    - expect: Input controls are present and constrained
  2. Enter common attack payloads (e.g., SQLi: "' OR '1'='1", XSS: "<script>alert(1)</script>") into search/form fields and submit
    - expect: Application rejects or sanitizes dangerous input without server errors
    - expect: No script execution in the browser and no stack traces exposed
