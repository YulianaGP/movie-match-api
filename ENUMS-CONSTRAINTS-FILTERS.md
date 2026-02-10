# Lab 14 - Enums, Constraints & Filters

## Overview

This lab introduces a Prisma enum (`Genre`) to replace free-text genre values, adds
server-side validation, and updates the frontend to consume genres dynamically from the API.

## What Changed

### 1. Prisma Schema

Added a `Genre` enum with 6 fixed values and changed the `genre` field type:

```prisma
enum Genre {
  ACTION
  COMEDY
  DRAMA
  HORROR
  SCIFI
  THRILLER
}

model Movie {
  genre Genre[]   // was String[]
}
```

PostgreSQL now rejects any value outside the enum at the database level.

### 2. Data Normalization

The seed had 16 legacy genres (Action, Adventure, Crime, etc.) mapped to 6 enum values:

| Legacy Genre | Mapped To | Legacy Genre | Mapped To |
|-------------|-----------|-------------|-----------|
| Action | ACTION | Adventure | ACTION |
| Animation | COMEDY | Biography | DRAMA |
| Comedy | COMEDY | Crime | THRILLER |
| Drama | DRAMA | Family | COMEDY |
| Fantasy | SCIFI | History | DRAMA |
| Music | DRAMA | Mystery | THRILLER |
| Romance | DRAMA | Sci-Fi | SCIFI |
| Thriller | THRILLER | War | ACTION |

Duplicates within a movie are removed after mapping (e.g. Crime + Thriller both map to THRILLER, stored once).

### 3. Backend Changes

| File | Change |
|------|--------|
| `src/services/movies.service.js` | Added `getGenres()` and `isValidGenre()` using `Object.values(Genre)` from Prisma client |
| `src/controllers/movies.controller.js` | Added `getMovieGenres` handler; genre validation on POST and PUT |
| `src/routes/movies.routes.js` | Added `GET /movies/genres` before `/:id` to avoid route collision |

**New endpoint response:**

```json
GET /api/movies/genres
{
  "success": true,
  "data": [
    { "value": "ACTION", "label": "Action" },
    { "value": "COMEDY", "label": "Comedy" },
    ...
  ]
}
```

**Validation example:**

```json
POST /api/movies  { "genre": ["INVALID"] }
-> 400 "Invalid genre(s): INVALID. Valid genres: ACTION, COMEDY, DRAMA, HORROR, SCIFI, THRILLER"
```

### 4. Frontend Changes

| File | Change |
|------|--------|
| `services/api.js` | Added `getGenres()` function |
| `MovieFilters.jsx` | Replaced hardcoded genre array with API call to `GET /movies/genres` |
| `MovieForm.jsx` | Replaced text input with checkbox group loaded from API |
| `MovieEditForm.jsx` | Same checkbox approach as MovieForm |
| `App.css` | Added `.genre-checkboxes` styles |

No genre values are hardcoded in the frontend.

### 5. Migration

```bash
npx prisma migrate dev --name init_with_genre_enum   # Creates enum + table
node prisma/seed.js                                   # Seeds 30 normalized movies
```

## Files Modified

| Layer | Files |
|-------|-------|
| Schema | `prisma/schema.prisma`, `prisma/seed.js` |
| Service | `src/services/movies.service.js` |
| Controller | `src/controllers/movies.controller.js` |
| Routes | `src/routes/movies.routes.js` |
| Frontend | `api.js`, `MovieFilters.jsx`, `MovieForm.jsx`, `MovieEditForm.jsx`, `App.css` |

## Verification Checklist

- [x] `GET /api/movies/genres` returns 6 genres dynamically from Prisma enum
- [x] `POST` with invalid genre returns 400 with descriptive error
- [x] `PUT` with invalid genre returns 400
- [x] Filters combine correctly (genre + minRating + director + year)
- [x] Frontend dropdown and checkboxes consume genres from API
- [x] "Clear filters" button resets the movie list
- [x] All 30 seeded movies use only valid enum values
