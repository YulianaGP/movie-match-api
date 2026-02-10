# Movie Match API

A professional REST API to explore, manage and discover movies from the IMDb Top 250. Built with Node.js, Express and PostgreSQL (via Prisma ORM) following a clean MVC architecture. Includes AI-powered movie enrichment via OpenRouter and a React frontend.

## Description

Movie Match is a full-stack application consisting of a backend API and a React frontend. The API provides full CRUD operations with advanced filtering, sorting, and pagination. Data is persisted in a PostgreSQL database hosted on Neon.tech, managed through Prisma ORM v6.

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js v5** - Minimalist and flexible web framework
- **Prisma ORM v6** - Type-safe database client and schema management
- **PostgreSQL (Neon.tech)** - Cloud-hosted relational database
- **ES Modules (ESM)** - Modern JavaScript module system
- **Nodemon** - Development tool for auto-reload
- **Swagger UI Express** - Interactive API documentation
- **CORS** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library for building user interfaces
- **Vite** - Fast build tool and development server

## Architecture

### Project Structure

```
movie-match/
├── movie-match-api/                        # Backend API
│   ├── prisma/
│   │   ├── schema.prisma                   # Database schema definition
│   │   └── seed.js                         # Database seed (30 movies)
│   ├── data/
│   │   └── movies.js                       # Original dataset (legacy)
│   ├── docs/
│   │   └── swagger.yaml                    # OpenAPI 3.0 documentation
│   ├── src/
│   │   ├── controllers/
│   │   │   └── movies.controller.js        # Request/response handling (async)
│   │   ├── lib/
│   │   │   └── prisma.js                   # Prisma client singleton
│   │   ├── middlewares/
│   │   │   ├── cors.middleware.js           # CORS configuration
│   │   │   ├── errorHandler.middleware.js   # Global error handling
│   │   │   ├── logger.middleware.js         # Request logging with timestamp
│   │   │   ├── notFound.middleware.js       # Centralized 404 handler
│   │   │   └── index.js                    # Barrel export for middlewares
│   │   ├── routes/
│   │   │   └── movies.routes.js            # Endpoint definitions (CRUD)
│   │   ├── services/
│   │   │   ├── movies.service.js           # Business logic with Prisma queries
│   │   │   └── ai.service.js               # AI enrichment via OpenRouter
│   │   ├── filters/
│   │   │   └── movies.filters.js           # Pure filter functions (legacy)
│   │   └── utils/
│   │       └── response.js                 # Response format helpers
│   ├── .env.example                        # Environment variables template
│   ├── index.js                            # Server bootstrap
│   └── package.json
│
└── movie-match-ui/                         # Frontend React App
    └── src/
        ├── components/
        │   ├── MovieList.jsx               # Movie cards with edit/delete
        │   ├── MovieForm.jsx               # Create movie form
        │   ├── MovieEditForm.jsx           # Inline edit form
        │   ├── MovieFilters.jsx            # Genre, rating, director filters
        │   └── Pagination.jsx              # Page navigation controls
        ├── services/
        │   └── api.js                      # API client with fetch
        ├── App.jsx                         # Main application component
        └── App.css                         # Application styles
```

### Design Patterns

- **MVC Architecture**: Routes -> Controllers -> Services -> Database (Prisma)
- **Singleton Pattern**: Single Prisma client instance across the application
- **Middleware Pipeline**: CORS -> Logger -> Body Parser -> Routes -> NotFound -> ErrorHandler
- **Async/Await**: All database operations are non-blocking
- **Separation of Concerns**: Frontend and backend in separate directories
- **ES Modules**: Modern `import/export` syntax

## API Endpoints

### Read Operations

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| GET    | `/`                    | Welcome message with endpoint list |
| GET    | `/api/movies`          | List all movies (with filters)     |
| GET    | `/api/movies/:id`      | Get movie by ID                    |
| GET    | `/api/movies/random`   | Get a random movie                 |
| GET    | `/api/movies/stats`    | Movie statistics by genre          |
| GET    | `/api/movies/genres`   | Valid genre list (from enum)       |
| GET    | `/api/movies/discover` | AI-enriched random movies          |
| GET    | `/docs`                | Swagger UI documentation           |

### Write Operations

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/api/movies`         | Create a new movie  |
| PUT    | `/api/movies/:id`     | Update a movie      |
| DELETE | `/api/movies/:id`     | Delete a movie      |

### Query Parameters (GET /api/movies)

| Parameter  | Description                        | Example              |
|------------|------------------------------------|----------------------|
| genre      | Filter by genre (enum value)       | `?genre=ACTION`      |
| minRating  | Minimum rating                     | `?minRating=8.5`     |
| year       | Filter by year                     | `?year=1994`         |
| director   | Partial match (case-insensitive)   | `?director=nolan`    |
| sortBy     | Sort field: title, rating, year    | `?sortBy=rating`     |
| order      | Sort direction: asc or desc        | `?order=desc`        |
| page       | Page number (starts at 1)          | `?page=1`            |
| limit      | Results per page                   | `?limit=10`          |

### Response Format

**Success (list):**
```json
{
  "success": true,
  "count": 10,
  "total": 30,
  "data": [...]
}
```

**Success (single):**
```json
{
  "success": true,
  "count": 1,
  "data": { "id": 1, "title": "The Shawshank Redemption", ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Movie not found"
}
```

## Installation and Usage

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- PostgreSQL database (Neon.tech recommended)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/YulianaGP/movie-match-api.git
cd movie-match-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL` (from Neon.tech):
```
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"
PORT=3000
```

4. Sync database schema and generate Prisma client:
```bash
npx prisma db push
npx prisma generate
```

5. Seed the database with 30 movies:
```bash
npx prisma db seed
```

6. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd movie-match-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser.

> Both servers must be running simultaneously for the full application to work.

### Environment Variables

| Variable            | Description                          | Required | Default |
|---------------------|--------------------------------------|----------|---------|
| DATABASE_URL        | PostgreSQL connection string (Neon)  | Yes      | -       |
| PORT                | Server port                          | No       | 3000    |
| OPENROUTER_API_KEY  | API key from OpenRouter              | No*      | -       |
| CORS_ORIGIN         | Allowed origins for CORS             | No       | *       |

*Required only for the `/api/movies/discover` AI enrichment feature.

## Available Scripts

### Backend (movie-match-api)
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon (auto-reload)
- `npx prisma db push` - Sync schema with database
- `npx prisma generate` - Generate Prisma client
- `npx prisma db seed` - Seed database with initial data
- `npx prisma studio` - Open Prisma Studio (visual database editor)

### Frontend (movie-match-ui)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production

## Labs Completed

### Lab 10: Professional REST API
- Filters: genre, minRating, year, director (combinable)
- Sorting: by title, rating, or year (asc/desc)
- Pagination: page and limit support
- Statistics endpoint
- Modular MVC architecture

### Lab 11: AI Integration
- AI Service: OpenRouter integration with Llama 3.2
- Discover Endpoint: `GET /api/movies/discover`
- Graceful Degradation: Works without API key

### Lab 12: Middleware, Documentation & Deploy Preparation
- Middlewares: Logger, CORS, NotFound (404), ErrorHandler (500)
- Swagger Documentation: Full OpenAPI 3.0 spec
- Environment Variables: `.env.example` template
- Deploy Ready: CORS configured, error handling environment-aware

### Lab 13: Database Migration & Frontend
- Migrated from in-memory data to PostgreSQL (Neon.tech)
- Prisma ORM v6 for database management
- Full CRUD operations (Create, Read, Update, Delete)
- Database seeding with 30 movies
- React frontend with Vite
- UI features: movie list, create/edit/delete, filters, pagination

### Lab 14: Enums, Constraints & Filters
- Prisma enum `Genre` with 6 values: ACTION, COMEDY, DRAMA, HORROR, SCIFI, THRILLER
- Normalized 16 legacy genres to 6 enum values via mapping
- Genre validation on POST/PUT (rejects invalid genres with 400)
- New endpoint: `GET /api/movies/genres` (dynamic, not hardcoded)
- Frontend dropdowns and checkboxes consume genres from API
- Combined filters: genre + minRating + director + year

## Author

**Yuliana GP**

- GitHub: [@YulianaGP](https://github.com/YulianaGP)
- Project: [movie-match-api](https://github.com/YulianaGP/movie-match-api)

## License

ISC
