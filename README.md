# Concert Reservation System

A full-stack ticketing application (NestJS, Next.js, PostgreSQL).

## Quick Start
Run the following from the root directory:

**1. Database**
```bash
docker-compose up -d
```

**2. Backend Server**
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

**3. Frontend Server** (in a new terminal tab)
```bash
cd frontend
npm install
npm run dev
```

## Running Tests
Tests are currently configured for the backend.
```bash
cd backend
npm test          # Unit tests
npm run test:e2e  # E2E tests
```
