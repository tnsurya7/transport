# 📡 API Documentation

All API responses follow a unified JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message string"
}
```

---

## 1. Public APIs (No Authentication Required)

### `GET /api/services`
Fetches all active transport services and their associated pricing rules.
- **Response**: Array of services with pricing tiers.

### `GET /api/locations/search?q={query}`
Searches cities, districts, and pincodes across Tamil Nadu, Karnataka, and Kerala.
- **Parameters**: `q` (Search query string, e.g. "Erode", "638001", "Bengaluru")
- **Response**: Array of matching location records with coordinates.

### `POST /api/quote`
Calculates road distance and estimated transport cost.
- **Request Body**:
```json
{
  "pickup": {
    "city": "Erode",
    "district": "Erode",
    "state": "Tamil Nadu",
    "pincode": "638001",
    "latitude": 11.3410,
    "longitude": 77.7172
  },
  "destination": {
    "city": "Coimbatore",
    "district": "Coimbatore",
    "state": "Tamil Nadu",
    "pincode": "641001",
    "latitude": 11.0168,
    "longitude": 76.9558
  },
  "serviceId": "srv-cargo-03",
  "loadCapacity": "2.5–5 Ton"
}
```
- **Response**: Quotation breakdown with `distanceKm`, `ratePerKm`, `baseAmount`, and `estimatedAmount`.

### `POST /api/bookings`
Creates a guest booking, records a pricing snapshot, and dispatches localized confirmation emails.
- **Request Body**:
```json
{
  "customerName": "Surya Kumar",
  "customerPhone": "+919876543210",
  "customerEmail": "customer@example.com",
  "customerLanguage": "ta",
  "serviceId": "srv-cargo-03",
  "loadCapacity": "2.5–5 Ton",
  "pickup": { "city": "Erode", "state": "Tamil Nadu", "pincode": "638001" },
  "destination": { "city": "Coimbatore", "state": "Tamil Nadu", "pincode": "641001" },
  "customerNotes": "2nd floor, elevator available"
}
```
- **Response**: Booking details with generated `bookingNumber` (e.g. `BK-2026-000001`).

### `GET /api/tracking/:trackingId`
Retrieves public shipment status and milestone timeline without exposing sensitive customer information.
- **Parameters**: `trackingId` (Tracking ID or Booking Number)
- **Response**: Sanitized shipment status, route, and event logs.

---

## 2. Admin APIs (Requires `admin_token` HTTP-Only Cookie)

### `POST /api/admin/auth/login`
Authenticates admin using email and password. Generates an HTTP-only JWT cookie.
- **Rate Limit**: Max 5 attempts per 15-minute window.

### `POST /api/admin/auth/logout`
Clears the session cookie.

### `GET /api/admin/me`
Returns the currently authenticated admin session.

### `GET /api/admin/dashboard`
Returns operational metrics and recent booking submissions.

### `GET /api/admin/bookings`
Lists bookings with pagination and filters.
- **Query Params**: `status`, `search`, `page`, `limit`

### `POST /api/admin/bookings/:id/confirm`
Confirms a booking:
1. Updates status to `CONFIRMED`.
2. Generates unique Tracking ID (e.g. `TRP-ERD-2026-000001`).
3. Creates initial tracking milestone event.
4. Sends confirmation email with tracking link.

### `PATCH /api/admin/bookings/:id/status`
Updates status and creates a new milestone event.
- **Statuses**: `VEHICLE_ASSIGNED`, `PICKUP_COMPLETED`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`.

### `PATCH /api/admin/bookings/:id/pricing`
Updates additional charges (loading, unloading, toll, waiting, discount) and sets the `finalAmount`.

### `POST /api/admin/bookings/:id/vehicle`
Assigns a vehicle and driver to the booking.

### `GET /api/admin/services` & `POST /api/admin/services`
Full CRUD for services.

### `POST /api/admin/pricing-rules` & `PATCH /api/admin/pricing-rules/:id`
Full CRUD for dynamic pricing tiers.
