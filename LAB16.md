# Lab 16 — Dashboard, Advanced Queries & Transactions

## Overview

This lab extends the Movie Match API with a **dashboard endpoint** (aggregations),
an **advanced search endpoint** (combined filters + pagination metadata), and a
**transactional delete** operation. The frontend gains a **Dashboard** tab, a
**Search** tab with explicit form-based filtering, and debounced reactive filters.

## Backend Changes

### New Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Aggregated statistics (totals, averages, top rated, genre breakdown) |
| GET | `/api/movies/search` | Advanced search with title, director, genre, year range, rating range |

### Architecture Additions

**Custom Error Classes** (`src/utils/AppError.js`)
Base `AppError` class with `NotFoundError` (404) and `ValidationError` (400) subclasses.
Controllers throw errors instead of manually calling `res.status()` — the global
error handler middleware catches them all in one place.

**Zod Validation** (`src/schemas/`, `src/middlewares/validate.middleware.js`)
Declarative schemas replace manual `if/else` validation. A higher-order middleware
factory `validate(schema, source)` parses `req.body`, `req.query`, or `req.params`
before the controller runs. Invalid data never reaches business logic.

**DTOs** (`src/dtos/movie.dto.js`)
Data Transfer Objects filter Prisma responses so the API only exposes intended fields.
Prevents accidental leakage of internal data if new columns are added later.

**Search Helpers** (`src/utils/search.helpers.js`)
Pure functions that build Prisma `where` clauses and pagination metadata.
Separated from services so they can be tested without a database.

**Dashboard Service** (`src/services/dashboard.service.js`)
Runs 7 parallel queries using `Promise.all` — total movies, total reviews,
average rating, top 5 rated, top 5 most reviewed, recent reviews, and per-genre
statistics. Parallel execution means the dashboard loads as fast as the slowest
single query, not the sum of all queries.

### Transactional Delete

`deleteMovie()` uses Prisma's `$transaction` to atomically delete all reviews
and then the movie itself. If any step fails, everything is rolled back.
Returns metadata including the count of deleted reviews.

### Performance Indices

Added `@@index` annotations to the Prisma schema for columns used in `WHERE`,
`ORDER BY`, and `JOIN` operations — `Movie.rating`, `Movie.year`, `Review.movieId`,
`Review.createdAt`, `Review.rating`. These speed up queries on large datasets.

### Error Handler Improvements

The global error handler now recognizes four error types:
1. `AppError` — uses its `statusCode` and `message`
2. `ZodError` — returns 400 with per-field details
3. Prisma `P2025` — returns 404 (record not found)
4. Prisma `P2002` — returns 409 (unique constraint violation)

## Frontend Changes

### New Tabs

**Dashboard** — Displays stat cards (total movies, total reviews, average rating),
a CSS-only genre bar chart, top 5 rated movies, most reviewed movies, and recent
reviews. No external chart library required.

**Search** — Form-based advanced search with 7 filter fields: title, director,
genre, year range (min/max), and rating range (min/max). Results appear after
clicking "Search". Applied filters are shown as tags above the results.
Pagination is included.

### Reactive Filter Fixes

- `useCallback` on `fetchMovies` prevents stale closure bugs
- `useDebounce` on the director text input reduces API calls while typing
- Sort order dropdown is disabled when no sort field is selected

## Key Patterns Used

- **Express 5 async error forwarding** — no try/catch in controllers
- **Higher-order middleware** — `validate(schema, source)` factory
- **Prisma `$transaction`** — atomic multi-table operations
- **`Promise.all`** — parallel independent queries
- **Zod `z.coerce`** — automatic string-to-number conversion for query params
- **`z.nativeEnum(Genre)`** — Prisma enum as Zod validation source of truth
- **`useCallback` + `useEffect`** — correct React dependency management
- **Explicit vs reactive filtering** — two patterns for different UX needs

## File Summary

### Backend — New Files (10)
`src/utils/AppError.js`, `src/schemas/movie.schema.js`, `src/schemas/review.schema.js`,
`src/middlewares/validate.middleware.js`, `src/dtos/movie.dto.js`,
`src/utils/search.helpers.js`, `src/services/dashboard.service.js`,
`src/controllers/dashboard.controller.js`, `src/routes/dashboard.routes.js`,
`.prettierrc`

### Backend — Modified Files (10)
`index.js`, `package.json`, `prisma/schema.prisma`, `prisma/seed.js`,
`src/controllers/movies.controller.js`, `src/controllers/reviews.controller.js`,
`src/middlewares/errorHandler.middleware.js`, `src/middlewares/index.js`,
`src/routes/movies.routes.js`, `src/routes/reviews.routes.js`,
`src/services/movies.service.js`, `docs/swagger.yaml`

### Frontend — New Files (5)
`src/components/Dashboard.jsx`, `src/components/SearchMovies.jsx`,
`src/adapters/movie.adapter.js`, `src/hooks/useDebounce.js`

### Frontend — Modified Files (4)
`src/App.jsx`, `src/App.css`, `src/services/api.js`,
`src/components/MovieFilters.jsx`
