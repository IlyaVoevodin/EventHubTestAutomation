# EventHub API Test Plan

## Application Overview

API-focused regression and smoke test plan for the EventHub REST API based on the public documentation and the current Playwright project structure.

## Test Scenarios

### 1. EventHub API

**Seed:** `tests/seed.spec.ts`

#### 1.1. Health and configuration endpoints

**File:** `specs/api-test-plan.md`

**Steps:**
  1. Send GET /health against the EventHub API base URL.
    - expect: The response returns HTTP 200 and confirms the service is healthy.
  2. Send GET /config without authentication.
    - expect: The response returns HTTP 200 and exposes public configuration or feature flags.

#### 1.2. Authentication flow

**File:** `specs/api-test-plan.md`

**Steps:**
  1. Send POST /auth/register with a unique email and password.
    - expect: The API creates the account successfully or returns a clear validation error if the payload is invalid.
  2. Send POST /auth/login with valid credentials.
    - expect: The response returns HTTP 200 and a token that can be used for authenticated requests.
  3. Call GET /auth/me with the returned token.
    - expect: The response returns the authenticated user profile.
  4. Call GET /auth/me without a token or with an invalid token.
    - expect: The API rejects the request with an authorization error.

#### 1.3. Event CRUD coverage

**File:** `specs/api-test-plan.md`

**Steps:**
  1. Send GET /events and inspect the response payload.
    - expect: The response returns HTTP 200 and a list of events with identifiable fields.
  2. Send GET /events/{id} for a known valid event ID.
    - expect: The API returns the event details for that ID.
  3. Send GET /events/{id} for a non-existent ID.
    - expect: The API returns a not-found response instead of crashing.
  4. Send POST /events with an authenticated request body to create a new event.
    - expect: The API creates the event and returns the created resource with an ID.
  5. Send PUT /events/{id} to update the created event.
    - expect: The event is updated and the response reflects the new values.
  6. Send DELETE /events/{id} for the created event.
    - expect: The event is removed and subsequent fetches return not found.

#### 1.4. Booking lifecycle

**File:** `specs/api-test-plan.md`

**Steps:**
  1. Send GET /bookings with a valid token.
    - expect: The response returns HTTP 200 and a list of bookings for the authenticated user.
  2. Send POST /bookings with a valid payload for an available event.
    - expect: The booking is created successfully and the response contains booking details.
  3. Retrieve the booking by ID and by reference code.
    - expect: Both lookup endpoints return the same booking details.
  4. Cancel the booking with DELETE /bookings/{id}.
    - expect: The booking is canceled and the API reports the change clearly.

#### 1.5. Validation and negative cases

**File:** `specs/api-test-plan.md`

**Steps:**
  1. Submit malformed or incomplete payloads to auth, event, or booking endpoints.
    - expect: The API returns validation errors with clear details and does not fail unexpectedly.
  2. Use malformed IDs or unknown booking/event identifiers.
    - expect: The API returns appropriate not-found or validation responses.
  3. Call protected endpoints without authentication.
    - expect: The API consistently rejects the request with an authorization error.
