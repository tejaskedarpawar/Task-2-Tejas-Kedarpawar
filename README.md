# Week 2 — Database Integration (CRUD)
### DecodeLabs Backend Development | Batch 2026

A REST API built with Express.js and Prisma ORM, connected to a PostgreSQL database to permanently store, read, update, and delete user records.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js + Express | HTTP server and routing |
| Prisma v7 | ORM — translates JS to SQL |
| PostgreSQL | Relational database |
| Docker | Runs PostgreSQL in a container |
| dotenv | Environment variable management |

---

## Project Structure

```
week2-crud/
├── prisma/
│   ├── schema.prisma        # Database schema / blueprint
│   └── migrations/          # Auto-generated migration history
├── src/
│   ├── index.js             # Express server entry point
│   └── routes/
│       └── users.js         # All CRUD route handlers
├── prisma.config.ts         # Prisma v7 configuration
├── docker-compose.yml       # PostgreSQL container setup
├── .env                     # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## Database Schema

```prisma
model User {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  age        Int      @default(0)
  is_active  Boolean  @default(true)
  created_at DateTime @default(now())
}
```

---

## API Endpoints

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| POST | `/api/users` | Create a new user | 201 Created |
| GET | `/api/users` | Get all users | 200 OK |
| GET | `/api/users/:id` | Get a single user by ID | 200 OK |
| PUT | `/api/users/:id` | Update a user by ID | 200 OK |
| DELETE | `/api/users/:id` | Delete a user by ID | 204 No Content |

---

## Setup & Running

### Prerequisites
- Node.js
- Docker

### 1. Clone and install dependencies

```bash
git clone https://github.com/YOUR_USERNAME/week2-crud.git
cd week2-crud
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://admin:password123@localhost:5432/week2db"
PORT=3000
```

### 3. Start the database

```bash
sudo docker compose up -d
```

### 4. Run migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## Stopping the Project

```bash
# Stop server
Ctrl + C

# Stop database container
sudo docker compose down
```

---

## API Usage Examples

### Create a User
```
POST /api/users
Content-Type: application/json

{
  "email": "tejas@rcoem.edu",
  "age": 21
}
```

Response `201`:
```json
{
  "id": 1,
  "email": "tejas@rcoem.edu",
  "age": 21,
  "is_active": true,
  "created_at": "2026-07-02T10:00:00.000Z"
}
```

### Duplicate Email
```
POST /api/users
{ "email": "tejas@rcoem.edu", "age": 21 }
```

Response `409`:
```json
{ "error": "Email already exists" }
```

### Get All Users
```
GET /api/users
```

Response `200`:
```json
[
  {
    "id": 1,
    "email": "tejas@rcoem.edu",
    "age": 21,
    "is_active": true,
    "created_at": "2026-07-02T10:00:00.000Z"
  }
]
```

### Update a User
```
PUT /api/users/1
Content-Type: application/json

{
  "age": 22,
  "is_active": false
}
```

Response `200`: updated user object

### Delete a User
```
DELETE /api/users/1
```

Response `204`: no content

---

## Error Handling

| HTTP Code | Meaning | When |
|-----------|---------|------|
| 400 | Bad Request | Missing email or negative age |
| 404 | Not Found | User ID doesn't exist |
| 409 | Conflict | Email already registered |
| 500 | Internal Server Error | Unexpected server/database error |

Duplicate entries are caught via Prisma error code `P2002` (unique constraint violation) and returned as `409 Conflict`, following RFC 7231.

---

## Key Concepts Demonstrated

- **Data Persistence** — data survives server restarts via PostgreSQL
- **ORM Usage** — Prisma v7 with adapter pattern for type-safe DB queries
- **Schema Constraints** — UNIQUE, NOT NULL enforced at the database level
- **REST Conventions** — correct HTTP verbs and status codes throughout
- **Error Handling** — Prisma error codes mapped to meaningful HTTP responses
- **Security** — credentials stored in `.env`, never hardcoded

---

*DecodeLabs Industrial Training Kit — Batch 2026*
