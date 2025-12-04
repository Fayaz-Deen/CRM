# Personal CRM - API Reference

## Base URL

```
Development: http://localhost:8080/api
Production: https://your-domain.com/api
```

## Authentication

All endpoints except `/auth/login`, `/auth/register`, and `/auth/forgot-password` require authentication.

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Refresh

When the access token expires (401 response), use the refresh token to get a new access token.

---

## Auth Endpoints

### Register

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "profilePicture": null,
    "timezone": "Asia/Kolkata",
    "settings": {
      "birthdayReminderDays": 2,
      "anniversaryReminderDays": 2,
      "defaultFollowupDays": 7,
      "theme": "system",
      "notificationPrefs": { "push": true, "email": true }
    }
  }
}
```

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** Same as Register

### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Response:** Same as Register

### Get Profile

```http
GET /auth/profile
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "profilePicture": "https://...",
  "timezone": "Asia/Kolkata",
  "settings": {...}
}
```

### Update Profile

```http
PUT /auth/profile
```

**Request Body:**
```json
{
  "name": "John Smith",
  "timezone": "America/New_York",
  "profilePicture": "https://...",
  "settings": {
    "birthdayReminderDays": 3,
    "theme": "dark"
  }
}
```

### Change Password

```http
POST /auth/change-password
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password changed successfully"
}
```

### Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

### Delete Account

```http
DELETE /auth/account
```

**Response:** `200 OK`
```json
{
  "message": "Account deleted successfully"
}
```

---

## Contacts Endpoints

### Get All Contacts

```http
GET /contacts
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Jane Doe",
    "emails": ["jane@company.com"],
    "phones": ["+1234567890"],
    "whatsappNumber": "+1234567890",
    "instagramHandle": "janedoe",
    "company": "Acme Inc",
    "tags": ["client", "vip"],
    "address": "123 Main St",
    "notes": "Met at conference",
    "birthday": "1990-05-15",
    "anniversary": "2015-06-20",
    "profilePicture": "https://...",
    "lastContactedAt": "2024-12-01T10:00:00",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-12-01T10:00:00"
  }
]
```

### Get Contact by ID

```http
GET /contacts/{id}
```

**Response:** Same as single contact object above

### Create Contact

```http
POST /contacts
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "emails": ["jane@company.com"],
  "phones": ["+1234567890"],
  "whatsappNumber": "+1234567890",
  "instagramHandle": "janedoe",
  "company": "Acme Inc",
  "tags": ["client"],
  "address": "123 Main St",
  "notes": "Met at conference",
  "birthday": "1990-05-15",
  "anniversary": "2015-06-20",
  "profilePicture": "https://..."
}
```

**Response:** `200 OK` - Created contact object

### Update Contact

```http
PUT /contacts/{id}
```

**Request Body:** Same as Create (partial updates supported)

**Response:** `200 OK` - Updated contact object

### Delete Contact

```http
DELETE /contacts/{id}
```

**Response:** `200 OK`

### Search Contacts

```http
GET /contacts/search?q={query}
```

**Query Parameters:**
- `q` - Search query (searches name)

**Response:** Array of matching contacts

---

## Meetings Endpoints

### Get All Meetings

```http
GET /meetings
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "contactId": "contact-uuid",
    "meetingDate": "2024-12-01T14:00:00",
    "medium": "phone_call",
    "notes": "Discussed project timeline",
    "outcome": "Agreed on Q1 delivery",
    "followupDate": "2024-12-15",
    "createdAt": "2024-12-01T14:30:00",
    "updatedAt": "2024-12-01T14:30:00"
  }
]
```

### Get Meetings by Contact

```http
GET /meetings/contact/{contactId}
```

**Response:** Array of meetings for the contact (sorted by date descending)

### Get Upcoming Follow-ups

```http
GET /meetings/followups
```

**Response:** Array of meetings with future follow-up dates

### Create Meeting

```http
POST /meetings
```

**Request Body:**
```json
{
  "contactId": "contact-uuid",
  "meetingDate": "2024-12-01T14:00:00",
  "medium": "phone_call",
  "notes": "Discussed project timeline",
  "outcome": "Agreed on Q1 delivery",
  "followupDate": "2024-12-15"
}
```

**Medium Options:**
- `phone_call`
- `whatsapp`
- `email`
- `sms`
- `in_person`
- `video_call`
- `instagram_dm`
- `other`

**Response:** `200 OK` - Created meeting object

### Update Meeting

```http
PUT /meetings/{id}
```

**Request Body:** Same as Create (partial updates supported)

### Delete Meeting

```http
DELETE /meetings/{id}
```

**Response:** `200 OK`

---

## Reminders Endpoints

### Get All Reminders

```http
GET /reminders
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "contactId": "contact-uuid",
    "type": "BIRTHDAY",
    "scheduledAt": "2024-12-10T09:00:00",
    "sentAt": null,
    "status": "PENDING",
    "createdAt": "2024-12-01T00:00:00"
  }
]
```

**Reminder Types:**
- `BIRTHDAY`
- `ANNIVERSARY`
- `FOLLOWUP`
- `NO_CONTACT`

**Status:**
- `PENDING`
- `SENT`
- `DISMISSED`

### Get Pending Reminders

```http
GET /reminders/pending
```

**Response:** Array of pending reminders

### Dismiss Reminder

```http
PUT /reminders/{id}/dismiss
```

**Response:** `200 OK` - Updated reminder with status `DISMISSED`

---

## Shares Endpoints

### Share Contact

```http
POST /shares
```

**Request Body:**
```json
{
  "contactId": "contact-uuid",
  "sharedWithEmail": "colleague@company.com",
  "permission": "VIEW",
  "expiresAt": "2025-01-01T00:00:00",
  "note": "For the upcoming project"
}
```

**Permission Options:**
- `VIEW` - Can only view contact details
- `VIEW_ADD` - Can view and add meeting notes

**Response:** `200 OK`
```json
{
  "id": "share-uuid",
  "contactId": "contact-uuid",
  "contactName": "Jane Doe",
  "ownerUserId": "owner-uuid",
  "ownerName": "John Doe",
  "ownerEmail": "john@example.com",
  "sharedWithUserId": "shared-uuid",
  "sharedWithName": "Bob Smith",
  "sharedWithEmail": "colleague@company.com",
  "permission": "VIEW",
  "expiresAt": "2025-01-01T00:00:00",
  "note": "For the upcoming project",
  "createdAt": "2024-12-01T00:00:00"
}
```

### Get Contacts Shared By Me

```http
GET /shares/by-me
```

**Response:** Array of share objects

### Get Contacts Shared With Me

```http
GET /shares/with-me
```

**Response:** Array of share objects (only active, non-expired)

### Get Shared Contact Details

```http
GET /shares/contact/{contactId}
```

**Response:** Contact object (if shared with the requesting user)

### Update Share

```http
PUT /shares/{shareId}
```

**Request Body:**
```json
{
  "permission": "VIEW_ADD",
  "expiresAt": "2025-06-01T00:00:00",
  "note": "Extended access"
}
```

### Revoke Share

```http
DELETE /shares/{shareId}
```

**Response:** `204 No Content`

---

## Templates Endpoints

### Get All Templates

```http
GET /templates
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Follow-up",
    "type": "FOLLOWUP",
    "content": "Hi {name}, I wanted to follow up on our last conversation.",
    "createdAt": "2024-12-01T00:00:00"
  }
]
```

**Template Types:**
- `FOLLOWUP`
- `BIRTHDAY`
- `ANNIVERSARY`
- `CUSTOM`

### Get Templates by Type

```http
GET /templates/type/{type}
```

### Get Template by ID

```http
GET /templates/{id}
```

### Create Template

```http
POST /templates
```

**Request Body:**
```json
{
  "name": "Quick Check-in",
  "type": "CUSTOM",
  "content": "Hi {name}, just checking in. How are things going?"
}
```

### Update Template

```http
PUT /templates/{id}
```

**Request Body:** Same as Create

### Delete Template

```http
DELETE /templates/{id}
```

**Response:** `204 No Content`

---

## Dashboard Endpoints

### Get Dashboard Stats

```http
GET /dashboard/stats
```

**Response:** `200 OK`
```json
{
  "totalContacts": 150,
  "meetingsThisMonth": 25,
  "upcomingBirthdays": [
    { "id": "...", "name": "Jane Doe", "birthday": "1990-12-15", ... }
  ],
  "upcomingAnniversaries": [],
  "pendingFollowups": [
    { "id": "...", "followupDate": "2024-12-10", ... }
  ],
  "recentlyContacted": [
    { "id": "...", "name": "Bob Smith", "lastContactedAt": "2024-12-01T10:00:00", ... }
  ],
  "needsAttention": [
    { "id": "...", "name": "Alice Brown", "lastContactedAt": "2024-10-01T10:00:00", ... }
  ]
}
```

### Get Meetings Chart Data

```http
GET /dashboard/meetings-chart
```

**Response:** `200 OK`
```json
[
  { "week": "W1", "count": 5 },
  { "week": "W2", "count": 8 },
  { "week": "W3", "count": 12 },
  { "week": "W4", "count": 7 },
  { "week": "W5", "count": 10 },
  { "week": "W6", "count": 6 },
  { "week": "W7", "count": 9 },
  { "week": "W8", "count": 11 }
]
```

### Get Communication Medium Breakdown

```http
GET /dashboard/medium-breakdown
```

**Response:** `200 OK`
```json
[
  { "medium": "phone call", "count": 45 },
  { "medium": "whatsapp", "count": 32 },
  { "medium": "email", "count": 28 },
  { "medium": "in person", "count": 15 },
  { "medium": "video call", "count": 10 }
]
```

### Get Contacts Over Time

```http
GET /dashboard/contacts-over-time
```

**Response:** `200 OK`
```json
[
  { "month": "JAN", "count": 5 },
  { "month": "FEB", "count": 8 },
  { "month": "MAR", "count": 12 },
  { "month": "APR", "count": 7 },
  { "month": "MAY", "count": 15 },
  { "month": "JUN", "count": 10 },
  { "month": "JUL", "count": 18 },
  { "month": "AUG", "count": 14 },
  { "month": "SEP", "count": 20 },
  { "month": "OCT", "count": 16 },
  { "month": "NOV", "count": 22 },
  { "month": "DEC", "count": 8 }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "details": {
    "email": "must be a valid email address"
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

*Not yet implemented. Planned for future release.*

---

## Versioning

API versioning will be introduced in v2.0 with URL prefix `/api/v2/`.
