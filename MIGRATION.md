# Lab 13 - Migration Guide: In-Memory to PostgreSQL

This document details the migration of Movie Match API from an in-memory data source to a cloud-hosted PostgreSQL database, along with the addition of a React frontend.

## Why Migrate?

### The Problem with In-Memory Data

The original API stored movie data in a JavaScript array (`data/movies.js`). This approach had several critical limitations:

| Limitation | Impact |
|------------|--------|
| **Data loss on restart** | Any movie created, updated or deleted was lost when the server restarted |
| **No concurrent access** | Multiple server instances would each have their own copy of the data |
| **No complex queries** | Filtering and sorting had to be implemented manually in JavaScript |
| **Not production-ready** | No real application stores data in memory for production use |

### The Solution

Migrate to a **real database** (PostgreSQL) using an **ORM** (Prisma) to get:
- Persistent data that survives restarts
- Efficient queries handled by the database engine
- Scalability for multiple users and server instances
- Professional architecture ready for production

---

## Tools Used and Why

### 1. PostgreSQL

**What it is:** An open-source relational database management system (RDBMS).

**Why PostgreSQL over other databases:**
- Most advanced open-source relational database
- Native support for arrays (used for the `genre` field)
- JSON support for future flexibility
- Strong community and ecosystem
- Free and widely used in the industry

### 2. Neon.tech

**What it is:** A serverless PostgreSQL hosting platform (Database as a Service).

**Why Neon.tech:**
- Free tier with generous limits for development
- No local installation required
- PostgreSQL fully managed in the cloud
- Instant database provisioning
- Built-in dashboard for viewing tables and running SQL
- Connection pooling included

### 3. Prisma ORM v6

**What it is:** A modern Object-Relational Mapping (ORM) tool for Node.js.

**Why Prisma over raw SQL or other ORMs:**
- **Type-safe queries**: Prevents runtime errors by validating queries at build time
- **Schema as code**: Database structure defined in a readable `.prisma` file
- **Auto-generated client**: Creates JavaScript methods for every model automatically
- **Migration support**: Schema changes can be tracked and versioned
- **Prisma Studio**: Visual database editor included for free

**Why v6 specifically:**
- Stable and production-ready
- Compatible with the lab requirements
- Uses `prisma-client-js` generator for JavaScript projects

**Key Prisma concepts used:**

| Concept | Description | Example |
|---------|-------------|---------|
| `findMany()` | Retrieve multiple records with filters | `prisma.movie.findMany({ where: { rating: { gte: 8 } } })` |
| `findUnique()` | Retrieve a single record by unique field | `prisma.movie.findUnique({ where: { id: 1 } })` |
| `create()` | Insert a new record | `prisma.movie.create({ data: movieData })` |
| `update()` | Modify an existing record | `prisma.movie.update({ where: { id: 1 }, data: changes })` |
| `delete()` | Remove a record | `prisma.movie.delete({ where: { id: 1 } })` |
| `count()` | Count matching records | `prisma.movie.count({ where: filters })` |

### 4. CORS (Cross-Origin Resource Sharing)

**What it is:** A security mechanism built into web browsers that blocks requests between different origins (domain + port combinations).

**Why it's needed:**
```
Frontend: http://localhost:5173  (Vite dev server)
Backend:  http://localhost:3000  (Express API)
```

These are different origins (different ports), so the browser blocks the frontend from calling the backend unless CORS headers are present.

**How it's configured:**
```javascript
// src/middlewares/cors.middleware.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',  // Accept requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

- `origin: '*'` allows any frontend to access the API (suitable for development)
- `methods` specifies which HTTP methods are allowed
- `allowedHeaders` defines which headers the frontend can send

### 5. Singleton Pattern (Prisma Client)

**What it is:** A design pattern that ensures only one instance of an object exists.

**Why it's needed:**
Each `new PrismaClient()` opens a connection pool to the database. Creating multiple instances would:
- Exhaust the database connection limit (especially on Neon's free tier)
- Slow down the application
- Cause connection errors

**Implementation:**
```javascript
// src/lib/prisma.js
const prisma = new PrismaClient();  // Created once
export default prisma;              // Reused everywhere
```

### 6. React + Vite (Frontend)

**Why React:**
- Most popular UI library for building interactive interfaces
- Component-based architecture for reusable UI pieces
- Large ecosystem and community

**Why Vite over Create React App:**
- Instant server start (no bundling on startup)
- Fast Hot Module Replacement (HMR)
- Optimized production builds
- Modern and actively maintained (CRA is deprecated)

### 7. dotenv (Environment Variables)

**What it is:** A package that loads variables from a `.env` file into `process.env`.

**Why it's critical:**
- Database credentials (connection strings) must NEVER be in source code
- `.env` files are excluded from git via `.gitignore`
- Different environments (dev, staging, production) use different values
- `.env.example` provides a template without sensitive data

---

## What Changed in the Code

### Service Layer (Before vs After)

The service layer was the primary target of migration. Controllers and routes remained structurally the same.

**Before (in-memory):**
```javascript
import { movies } from '../../data/movies.js';

export const getAllMovies = (filters) => {
  let result = [...movies];           // Copy array
  // Manual filtering with JavaScript
  if (filters.genre) {
    result = result.filter(m => m.genre.includes(filters.genre));
  }
  return result;
};

export const getMovieById = (id) => {
  return movies.find(movie => movie.id === id);  // Array.find()
};
```

**After (Prisma + PostgreSQL):**
```javascript
import prisma from '../lib/prisma.js';

export const getAllMovies = async (filters) => {
  const where = {};
  if (filters.genre) {
    where.genre = { has: filters.genre };         // Database query
  }
  const movies = await prisma.movie.findMany({ where });
  return movies;
};

export const getMovieById = async (id) => {
  return await prisma.movie.findUnique({ where: { id } });
};
```

### Key Differences

| Aspect | Before (In-Memory) | After (Prisma) |
|--------|---------------------|----------------|
| Data source | JavaScript array | PostgreSQL database |
| Functions | Synchronous | Asynchronous (async/await) |
| Filtering | Manual `Array.filter()` | Database `WHERE` clauses |
| Sorting | Manual `Array.sort()` | Database `ORDER BY` |
| Pagination | Manual `Array.slice()` | Database `SKIP` and `TAKE` |
| Persistence | Lost on restart | Permanent |
| CRUD | Read-only | Full Create, Read, Update, Delete |

### Files Added

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema definition (Movie model) |
| `prisma/seed.js` | Script to populate database with 30 movies |
| `src/lib/prisma.js` | Prisma client singleton |

### Files Modified

| File | Change |
|------|--------|
| `src/services/movies.service.js` | Replaced array operations with Prisma queries |
| `src/controllers/movies.controller.js` | Added async/await, new CRUD handlers |
| `src/routes/movies.routes.js` | Added POST, PUT, DELETE routes |
| `package.json` | Added Prisma dependencies and seed config |
| `.gitignore` | Added Prisma generated files |

---

## Database Schema

```prisma
model Movie {
  id          Int      @id @default(autoincrement())
  title       String
  year        Int
  genre       String[]    // PostgreSQL native array
  rating      Float
  director    String
  description String
}
```

### Field Type Mapping

| Field | Prisma Type | PostgreSQL Type | Reason |
|-------|-------------|-----------------|--------|
| id | `Int @id @default(autoincrement())` | `SERIAL PRIMARY KEY` | Auto-incrementing unique identifier |
| title | `String` | `TEXT` | Variable-length text |
| year | `Int` | `INTEGER` | Whole number |
| genre | `String[]` | `TEXT[]` | Native array, supports `has` operator for filtering |
| rating | `Float` | `DOUBLE PRECISION` | Decimal number (e.g., 8.7) |
| director | `String` | `TEXT` | Supports `contains` for partial search |
| description | `String` | `TEXT` | Long text content |

---

## Frontend Architecture

### Data Flow

```
User Action -> React Component -> API Service (fetch) -> Express API -> Prisma -> PostgreSQL
     ^                                                                                |
     |________________________________________________________________________________|
                                    JSON Response
```

### Components

| Component | Responsibility |
|-----------|---------------|
| `App.jsx` | State management (movies, filters, pagination), data fetching |
| `MovieForm.jsx` | Form to create new movies (POST) |
| `MovieEditForm.jsx` | Inline edit form within movie cards (PUT) |
| `MovieList.jsx` | Renders movie cards, handles edit/delete |
| `MovieFilters.jsx` | Genre, rating, director, and sort controls |
| `Pagination.jsx` | Previous/Next page navigation |
| `api.js` | Centralized API calls with fetch |

---

## Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `ERR_MODULE_NOT_FOUND` for Prisma | Wrong generator or import path | Use `prisma-client-js` generator and import from `@prisma/client` |
| `@prisma/client did not initialize` | Prisma client not generated | Run `npx prisma generate` |
| `net::ERR_CONNECTION_REFUSED` | Backend not running | Start API with `npm run dev` before using the frontend |
| CORS blocked | Missing CORS middleware | Ensure `app.use(corsMiddleware)` is before routes |
| VS Code Prisma warning about `url` | Extension configured for Prisma 7 | Safe to ignore when using Prisma v6 |
| Data lost after restart | Still using in-memory data | Verify service imports `prisma` instead of `movies.js` |

---

## Useful Commands Reference

```bash
# Database
npx prisma db push          # Sync schema -> database
npx prisma generate         # Generate client code
npx prisma db seed          # Load 30 movies into database
npx prisma studio           # Visual database editor (browser)

# Development
npm run dev                 # Start API with auto-reload (port 3000)
cd ../movie-match-ui && npm run dev  # Start frontend (port 5173)
```
