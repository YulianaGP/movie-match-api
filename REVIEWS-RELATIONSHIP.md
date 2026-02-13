# Lab 15 — One-to-Many Relationship: Movie Reviews

## Overview

This lab implements a **1:N relationship** between `Movie` and `Review` models using Prisma ORM.
Each movie can have multiple reviews. Deleting a movie cascades to its reviews.

The implementation follows the existing layered architecture: **routes → controllers → services**.

---

## 1. Prisma Schema Changes

### Review Model

A new `Review` model was added to `prisma/schema.prisma`:

```prisma
model Review {
  id        Int      @id @default(autoincrement())
  movieId   Int
  author    String
  rating    Int
  comment   String
  createdAt DateTime @default(now())
  movie     Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)
}
```

### Movie Model Update

Only the `reviews` relation field was added. **No existing fields were modified**:

```prisma
model Movie {
  ...
  reviews   Review[]
}
```

### Design Decisions

- `onDelete: Cascade` ensures reviews are automatically removed when a movie is deleted.
- `createdAt` defaults to `now()` at the database level, keeping the service layer clean.
- The `Genre[]` enum array was left completely untouched.

---

## 2. Service Layer — `reviews.service.js`

### Methods

| Method | Purpose | Returns |
|---|---|---|
| `getReviewsByMovie(movieId)` | Fetch all reviews for a movie | `Review[]` or `null` |
| `getReviewById(id)` | Find a single review | `Review` or `null` |
| `createReview(movieId, data)` | Create a review for a movie | `Review` or `null` |
| `updateReview(reviewId, data)` | Partially update a review | `Review` or `null` |
| `deleteReview(reviewId)` | Delete a review | `Review` or `null` |

### Architectural Consistency

The service follows the same pattern as `movies.service.js`:
- Returns data on success, `null` when a resource is not found.
- **Never returns HTTP status codes** — that responsibility belongs to the controller.
- Validates movie existence inside `createReview` since it is a business rule (a review cannot exist without a movie).

### Single Query Optimization

`getReviewsByMovie` uses Prisma's `include` to fetch the movie and its reviews in a single query instead of two separate calls:

```js
const movie = await prisma.movie.findUnique({
  where: { id: movieId },
  include: { reviews: { orderBy: { createdAt: 'desc' } } },
});
```

---

## 3. Controller Layer — `reviews.controller.js`

### Responsibilities

- Parses and validates request input (author, rating, comment).
- Converts `movieId` and `reviewId` from string params to numbers.
- Delegates business logic to the service.
- Returns appropriate HTTP status codes (200, 201, 400, 404, 500).
- Includes `console.error(error)` in catch blocks for development debugging.

### Validation Rules (handled in controller)

| Field | Rule |
|---|---|
| `author` | Required, non-empty after trim |
| `comment` | Required, non-empty after trim |
| `rating` | Required, integer between 1 and 5 |

This is consistent with `movies.controller.js`, where input validation also lives in the controller.

---

## 4. Routes — `reviews.routes.js`

### Nested Routing with `mergeParams`

```js
const router = Router({ mergeParams: true });
```

The review router uses `mergeParams: true` so it can access `:movieId` from the parent router.
It is mounted inside `movies.routes.js`:

```js
router.use('/:movieId/reviews', reviewsRouter);
```

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies/:movieId/reviews` | List all reviews for a movie |
| `POST` | `/api/movies/:movieId/reviews` | Create a new review |
| `PUT` | `/api/movies/:movieId/reviews/:reviewId` | Update a review |
| `DELETE` | `/api/movies/:movieId/reviews/:reviewId` | Delete a review |

---

## 5. Existing Code Updates

### `getMovieById` — now includes reviews

The only change to `movies.service.js` was adding `include` to `getMovieById`:

```js
include: { reviews: { orderBy: { createdAt: 'desc' } } }
```

`GET /api/movies/:id` now returns the movie with its reviews sorted by newest first.

### `sendSuccess` — now accepts optional status code

Updated `src/utils/response.js` to support `sendSuccess(res, data, 201)`:

```js
export const sendSuccess = (res, data, status = 200) => { ... };
```

The default remains `200`, so all existing calls work without modification.

---

## 6. What Was NOT Changed

- `movies.controller.js` — untouched
- `ai.service.js` — untouched
- `index.js` — untouched (review routes are nested via movies router)
- All middlewares — untouched
- `Genre[]` enum — untouched
- Filters, sorting, and pagination — untouched

---

## 7. Future Recommendations

These are **not needed now** but would improve scalability if the project grows:

1. **Zod/Joi validation middleware** — move input validation from controllers into schema-based middleware on routes.
2. **Custom error classes** (`NotFoundError`, `ValidationError`) — throw from services, catch in `errorHandler` middleware, eliminate repetitive `sendError` calls.
3. **Pagination for reviews** — apply `page`/`limit` query params to `getReviewsByMovie`, reusing the same pattern from `getAllMovies`.
