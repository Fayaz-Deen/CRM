# Personal CRM

A Progressive Web Application (PWA) for managing business relationships, contacts, meetings, and follow-ups. Built with React + TypeScript frontend and Spring Boot backend.

## Features

- **Contact Management** - Store and organize business contacts with full details
- **Meeting Logging** - Track all interactions with timeline view
- **Smart Reminders** - Birthday, anniversary, follow-up, and no-contact alerts
- **Communication Shortcuts** - One-tap WhatsApp, Email, SMS, Phone, Instagram
- **Contact Sharing** - Share contacts with other users (view/edit permissions)
- **Message Templates** - Pre-filled templates for quick communication
- **Analytics Dashboard** - Visualize your networking activity
- **PWA Support** - Installable, works offline, mobile-friendly

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS, Zustand, Vite |
| Backend | Spring Boot 2.7, Java 11, Spring Security, JPA |
| Database | MySQL 8.0 |
| PWA | Workbox, Dexie (IndexedDB) |
| Auth | JWT + Google OAuth 2.0 |

## Quick Start

### Prerequisites

- Java 11+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Setup

1. **Clone and configure**
   ```bash
   git clone <repository-url>
   cd CRM
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Create database**
   ```sql
   CREATE DATABASE personal_crm;
   ```

3. **Start backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

4. **Start frontend** (in new terminal)
   ```bash
   npm install
   npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api

### Docker Deployment

```bash
docker-compose up -d
```

App will be available at http://localhost:8080

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design, data models, tech stack |
| [Implementation Status](docs/IMPLEMENTATION_STATUS.md) | Feature completion tracking |
| [API Reference](docs/API_REFERENCE.md) | Complete API documentation |
| [Setup Guide](docs/SETUP_GUIDE.md) | Development environment setup |
| [Roadmap](docs/ROADMAP.md) | Future features and enhancements |
| [Requirements](Requirement.md) | Original MVP specification |

## Project Structure

```
CRM/
├── src/                    # Frontend (React/TypeScript)
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── store/              # Zustand state management
│   ├── services/           # API client
│   └── types/              # TypeScript interfaces
├── backend/                # Backend (Spring Boot)
│   └── src/main/java/com/crm/
│       ├── controller/     # REST endpoints
│       ├── service/        # Business logic
│       ├── repository/     # Data access
│       └── entity/         # JPA entities
├── docs/                   # Documentation
├── docker-compose.yml      # Docker setup
└── package.json            # Frontend dependencies
```

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `/api/auth/*` - Login, register, profile |
| Contacts | `/api/contacts/*` - CRUD operations |
| Meetings | `/api/meetings/*` - Interaction logging |
| Reminders | `/api/reminders/*` - Notifications |
| Shares | `/api/shares/*` - Contact sharing |
| Templates | `/api/templates/*` - Message templates |
| Dashboard | `/api/dashboard/*` - Analytics |

See [API Reference](docs/API_REFERENCE.md) for complete documentation.

## Scripts

### Frontend

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview build
```

### Backend

```bash
mvn compile        # Compile
mvn test           # Run tests
mvn spring-boot:run  # Run application
mvn package        # Build JAR
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | JWT signing key (256+ bits) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
