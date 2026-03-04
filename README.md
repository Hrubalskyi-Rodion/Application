# Application - Event Management System

A full-stack event management application built with React, NestJS, and PostgreSQL.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Zustand, React Big Calendar
- **Backend**: NestJS, TypeScript, TypeORM, JWT
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose

## Prerequisites

- Node.js 18+
- Docker Desktop

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Hrubalskyi-Rodion/Application.git
cd Application
```

### 2. Start the database

```bash
docker-compose up -d
```

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Seed the database (optional)

```bash
cd backend
npm run seed
```

## Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger docs: http://localhost:3000/api

## Test credentials

- Email: alice@test.com / Password: password123
- Email: bob@test.com / Password: password123

## API Endpoints

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | /auth/register    | Register user     |
| POST   | /auth/login       | Login user        |
| GET    | /events           | Get public events |
| GET    | /events/:id       | Get single event  |
| POST   | /events           | Create event      |
| PATCH  | /events/:id       | Update event      |
| DELETE | /events/:id       | Delete event      |
| POST   | /events/:id/join  | Join event        |
| POST   | /events/:id/leave | Leave event       |
| GET    | /users/me/events  | Get user events   |

```

Також створи `backend/.env.example`:
```

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=events_db
JWT_SECRET=supersecretkey
