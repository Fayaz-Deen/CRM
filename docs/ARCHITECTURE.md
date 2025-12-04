# Personal CRM - Architecture Documentation

## Overview

Personal CRM is a full-stack Progressive Web Application (PWA) designed for individual users to manage personal and business relationships. The system follows a modern monorepo structure with a React frontend and Spring Boot backend.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    React PWA (TypeScript)                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │   │
│  │  │  Pages   │  │Components│  │  Stores  │  │  Service Workers │ │   │
│  │  │          │  │    UI    │  │ (Zustand)│  │    (Workbox)     │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │   │
│  │                         │                           │            │   │
│  │                    ┌────┴────┐              ┌───────┴───────┐   │   │
│  │                    │   API   │              │   IndexedDB   │   │   │
│  │                    │ Client  │              │    (Dexie)    │   │   │
│  │                    └────┬────┘              └───────────────┘   │   │
│  └─────────────────────────┼───────────────────────────────────────┘   │
└────────────────────────────┼───────────────────────────────────────────┘
                             │ HTTPS/REST
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              SERVER LAYER                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  Spring Boot Application                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │   │
│  │  │  Controllers │  │   Services   │  │  Security (JWT)      │  │   │
│  │  │  (REST API)  │  │   (Business  │  │  - JwtAuthFilter     │  │   │
│  │  │              │  │    Logic)    │  │  - JwtService        │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │   │
│  │          │                │                      │              │   │
│  │          └────────────────┼──────────────────────┘              │   │
│  │                           │                                      │   │
│  │                    ┌──────┴──────┐                               │   │
│  │                    │ Repositories│                               │   │
│  │                    │ (Spring JPA)│                               │   │
│  │                    └──────┬──────┘                               │   │
│  └───────────────────────────┼─────────────────────────────────────┘   │
└──────────────────────────────┼─────────────────────────────────────────┘
                               │ JDBC
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         MySQL 8.0                                │   │
│  │  ┌────────┐ ┌──────────┐ ┌─────────┐ ┌───────────┐ ┌─────────┐ │   │
│  │  │ Users  │ │ Contacts │ │Meetings │ │ Reminders │ │ Shares  │ │   │
│  │  └────────┘ └──────────┘ └─────────┘ └───────────┘ └─────────┘ │   │
│  │  ┌───────────────────┐                                          │   │
│  │  │ Message Templates │                                          │   │
│  │  └───────────────────┘                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.2.4 | Build Tool & Dev Server |
| Tailwind CSS | 4.1.17 | Styling |
| Zustand | 5.0.9 | State Management |
| React Router | 7.10.0 | Client-side Routing |
| Dexie | 4.2.1 | IndexedDB Wrapper (Offline) |
| React Hook Form | 7.67.0 | Form Management |
| Zod | 4.1.13 | Validation |
| Recharts | 3.5.1 | Data Visualization |
| Lucide React | 0.555.0 | Icons |
| date-fns | 4.1.0 | Date Utilities |
| Vite PWA Plugin | 1.2.0 | PWA Support |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 2.7.18 | Application Framework |
| Java | 11 | Programming Language |
| Spring Security | 5.7.x | Authentication & Authorization |
| Spring Data JPA | 2.7.x | Data Access |
| JJWT | 0.11.5 | JWT Token Management |
| MySQL Connector | 8.0.33 | Database Driver |
| Lombok | 1.18.30 | Boilerplate Reduction |
| Maven | 3.11.0 | Build Tool |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| MySQL 8.0 | Primary Database |
| Docker | Containerization |
| Docker Compose | Container Orchestration |

## Project Structure

```
CRM/
├── src/                              # Frontend Source
│   ├── components/
│   │   ├── ui/                       # Reusable UI Components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── contacts/
│   │   │   ├── ContactForm.tsx
│   │   │   └── ShareContactModal.tsx
│   │   └── meetings/
│   │       ├── MeetingForm.tsx
│   │       └── MeetingTimeline.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Contacts.tsx
│   │   ├── ContactDetail.tsx
│   │   ├── Meetings.tsx
│   │   ├── Reminders.tsx
│   │   ├── SharedWithMe.tsx
│   │   ├── Templates.tsx
│   │   ├── Settings.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── contactStore.ts
│   │   ├── meetingStore.ts
│   │   ├── shareStore.ts
│   │   └── templateStore.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── dates.ts
│   │   └── communication.ts
│   ├── db/
│   │   └── index.ts                  # Dexie IndexedDB Schema
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── backend/                          # Backend Source
│   └── src/main/java/com/crm/
│       ├── entity/
│       │   ├── User.java
│       │   ├── Contact.java
│       │   ├── Meeting.java
│       │   ├── Reminder.java
│       │   ├── Share.java
│       │   └── MessageTemplate.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── ContactRepository.java
│       │   ├── MeetingRepository.java
│       │   ├── ReminderRepository.java
│       │   ├── ShareRepository.java
│       │   └── MessageTemplateRepository.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── ContactService.java
│       │   ├── MeetingService.java
│       │   ├── ReminderService.java
│       │   ├── ShareService.java
│       │   ├── TemplateService.java
│       │   └── DashboardService.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── ContactController.java
│       │   ├── MeetingController.java
│       │   ├── ReminderController.java
│       │   ├── ShareController.java
│       │   ├── TemplateController.java
│       │   └── DashboardController.java
│       ├── security/
│       │   ├── JwtService.java
│       │   └── JwtAuthFilter.java
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   └── WebConfig.java
│       ├── dto/
│       │   ├── AuthRequest.java
│       │   ├── AuthResponse.java
│       │   ├── ContactDto.java
│       │   ├── MeetingDto.java
│       │   ├── ShareDto.java
│       │   └── TemplateDto.java
│       └── CrmApplication.java
│
├── docs/                             # Documentation
├── Dockerfile
├── docker-compose.yml
├── package.json
├── pom.xml (in backend/)
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Data Model

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      USER       │       │     CONTACT     │       │     MEETING     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │──┐    │ id (PK)         │
│ email           │  │    │ user_id (FK)    │◄─┘    │ contact_id (FK) │◄─┐
│ password_hash   │  │    │ name            │       │ user_id (FK)    │  │
│ google_id       │  │    │ emails (JSON)   │       │ meeting_date    │  │
│ name            │  │    │ phones (JSON)   │       │ medium          │  │
│ profile_picture │  │    │ whatsapp_number │       │ notes           │  │
│ timezone        │  │    │ instagram       │       │ outcome         │  │
│ settings (JSON) │  │    │ company         │       │ followup_date   │  │
│ created_at      │  │    │ tags (JSON)     │       │ created_at      │  │
│ updated_at      │  │    │ address         │       │ updated_at      │  │
└─────────────────┘  │    │ notes           │       └─────────────────┘  │
                     │    │ birthday        │                            │
                     │    │ anniversary     │───────────────────────────┘
                     │    │ profile_picture │
                     │    │ last_contacted  │
                     │    │ created_at      │
                     │    │ updated_at      │
                     │    └─────────────────┘
                     │            │
                     │            │
┌─────────────────┐  │    ┌───────┴─────────┐       ┌─────────────────┐
│    REMINDER     │  │    │      SHARE      │       │MESSAGE_TEMPLATE │
├─────────────────┤  │    ├─────────────────┤       ├─────────────────┤
│ id (PK)         │  │    │ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │◄─┤    │ contact_id (FK) │       │ user_id (FK)    │◄─┐
│ contact_id (FK) │  │    │ owner_user_id   │◄──────│ name            │  │
│ type            │  │    │ shared_with_id  │◄─┐    │ type            │  │
│ scheduled_at    │  │    │ permission      │  │    │ content         │  │
│ sent_at         │  │    │ expires_at      │  │    │ created_at      │  │
│ status          │  │    │ note            │  │    └─────────────────┘  │
│ created_at      │  │    │ created_at      │  │                         │
└─────────────────┘  │    └─────────────────┘  │                         │
                     │                         │                         │
                     └─────────────────────────┴─────────────────────────┘
```

### Entity Details

#### User
- Primary key: UUID
- Unique email constraint
- Password nullable (for OAuth users)
- Settings stored as JSON (reminder preferences, theme, notifications)

#### Contact
- Owned by a single user (user_id FK)
- Arrays (emails, phones, tags) stored as JSON
- Last contacted timestamp auto-updated on meeting creation

#### Meeting
- Links to both Contact and User
- Medium enum: PHONE_CALL, WHATSAPP, EMAIL, SMS, IN_PERSON, VIDEO_CALL, INSTAGRAM_DM, OTHER
- Optional follow-up date triggers reminder creation

#### Reminder
- Type enum: BIRTHDAY, ANNIVERSARY, FOLLOWUP, NO_CONTACT
- Status enum: PENDING, SENT, DISMISSED
- Scheduled via daily cron job

#### Share
- Enables contact sharing between users
- Permission enum: VIEW, VIEW_ADD
- Optional expiry date

#### MessageTemplate
- Type enum: FOLLOWUP, BIRTHDAY, ANNIVERSARY, CUSTOM
- Supports {name} placeholder for personalization

## API Architecture

### Authentication Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  POST /api/auth/login         │                               │
     │  {email, password}            │                               │
     │──────────────────────────────►│                               │
     │                               │  Verify credentials           │
     │                               │──────────────────────────────►│
     │                               │◄──────────────────────────────│
     │                               │                               │
     │                               │  Generate JWT + Refresh Token │
     │  {token, refreshToken, user}  │                               │
     │◄──────────────────────────────│                               │
     │                               │                               │
     │  GET /api/contacts            │                               │
     │  Authorization: Bearer {JWT}  │                               │
     │──────────────────────────────►│                               │
     │                               │  Validate JWT                 │
     │                               │  Extract userId               │
     │                               │──────────────────────────────►│
     │                               │◄──────────────────────────────│
     │  [contacts]                   │                               │
     │◄──────────────────────────────│                               │
     │                               │                               │
     │  (Token expired - 401)        │                               │
     │◄──────────────────────────────│                               │
     │                               │                               │
     │  POST /api/auth/refresh       │                               │
     │  {refreshToken}               │                               │
     │──────────────────────────────►│                               │
     │                               │  Validate refresh token       │
     │  {token, refreshToken, user}  │                               │
     │◄──────────────────────────────│                               │
     │                               │                               │
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Auth** |||
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/auth/profile | Get current user profile |
| PUT | /api/auth/profile | Update profile |
| POST | /api/auth/change-password | Change password |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password | Reset password |
| DELETE | /api/auth/account | Delete account |
| **Contacts** |||
| GET | /api/contacts | Get all contacts |
| GET | /api/contacts/{id} | Get contact by ID |
| POST | /api/contacts | Create contact |
| PUT | /api/contacts/{id} | Update contact |
| DELETE | /api/contacts/{id} | Delete contact |
| GET | /api/contacts/search | Search contacts |
| **Meetings** |||
| GET | /api/meetings | Get all meetings |
| GET | /api/meetings/contact/{id} | Get meetings for contact |
| GET | /api/meetings/followups | Get upcoming follow-ups |
| POST | /api/meetings | Create meeting |
| PUT | /api/meetings/{id} | Update meeting |
| DELETE | /api/meetings/{id} | Delete meeting |
| **Reminders** |||
| GET | /api/reminders | Get all reminders |
| GET | /api/reminders/pending | Get pending reminders |
| PUT | /api/reminders/{id}/dismiss | Dismiss reminder |
| **Shares** |||
| POST | /api/shares | Share contact |
| GET | /api/shares/by-me | Get contacts shared by user |
| GET | /api/shares/with-me | Get contacts shared with user |
| GET | /api/shares/contact/{id} | Get shared contact details |
| PUT | /api/shares/{id} | Update share settings |
| DELETE | /api/shares/{id} | Revoke share |
| **Templates** |||
| GET | /api/templates | Get all templates |
| GET | /api/templates/type/{type} | Get templates by type |
| POST | /api/templates | Create template |
| PUT | /api/templates/{id} | Update template |
| DELETE | /api/templates/{id} | Delete template |
| **Dashboard** |||
| GET | /api/dashboard/stats | Get dashboard statistics |
| GET | /api/dashboard/meetings-chart | Get weekly meetings data |
| GET | /api/dashboard/medium-breakdown | Get communication breakdown |
| GET | /api/dashboard/contacts-over-time | Get contacts growth data |

## Frontend State Management

### Zustand Stores

```
┌─────────────────────────────────────────────────────────────────┐
│                        ZUSTAND STORES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│  │  authStore  │   │contactStore │   │meetingStore │          │
│  ├─────────────┤   ├─────────────┤   ├─────────────┤          │
│  │ user        │   │ contacts    │   │ meetings    │          │
│  │ token       │   │ selected    │   │ selected    │          │
│  │ refreshToken│   │ isLoading   │   │ isLoading   │          │
│  │ isAuth      │   │ error       │   │ error       │          │
│  │ isLoading   │   │ searchQuery │   │             │          │
│  └─────────────┘   └─────────────┘   └─────────────┘          │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐                             │
│  │ shareStore  │   │templateStore│                             │
│  ├─────────────┤   ├─────────────┤                             │
│  │ sharedByMe  │   │ templates   │                             │
│  │ sharedWithMe│   │ isLoading   │                             │
│  │ isLoading   │   │ error       │                             │
│  │ error       │   │             │                             │
│  └─────────────┘   └─────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## PWA Architecture

### Offline Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE WORKER STRATEGY                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐                                           │
│  │  Static Assets  │  → Cache First (Precached)                │
│  │  (JS, CSS, HTML)│                                           │
│  └─────────────────┘                                           │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │   API Calls     │  → Network First (10s timeout)            │
│  │   (/api/*)      │    Fallback to cache if offline           │
│  └─────────────────┘                                           │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │   IndexedDB     │  → Local storage for offline data         │
│  │   (Dexie)       │    Sync queue for pending operations      │
│  └─────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### IndexedDB Schema (Dexie)

```javascript
// Collections
users:      'id, email'
contacts:   'id, userId, name, company, *tags, lastContactedAt'
meetings:   'id, contactId, userId, meetingDate, followupDate'
reminders:  'id, userId, contactId, type, scheduledAt, status'
templates:  'id, userId, type'
syncQueue:  '++id, type, entity, entityId, createdAt'
```

## Security Architecture

### Authentication & Authorization

1. **Password Security**: BCrypt hashing with salt
2. **JWT Tokens**:
   - Access token: 24-hour expiry
   - Refresh token: 7-day expiry
3. **CORS**: Configured for allowed origins
4. **User Isolation**: All queries filtered by userId

### Security Flow

```
Request → JwtAuthFilter → Extract Token → Validate → Set SecurityContext → Controller
                              ↓
                        (Invalid/Expired)
                              ↓
                         401 Response
```

## Deployment Architecture

### Docker Compose Setup

```yaml
services:
  app:
    - Spring Boot with embedded frontend
    - Port 8080
    - Environment variables for config

  db:
    - MySQL 8.0
    - Port 3306
    - Persistent volume for data
```

### Production Build

```
Frontend Build (Vite)     Backend Build (Maven)
        ↓                         ↓
   dist/ folder            target/*.jar
        ↓                         ↓
        └──────────┬──────────────┘
                   ↓
           Docker Image
           (Multi-stage build)
                   ↓
           Docker Compose
```
