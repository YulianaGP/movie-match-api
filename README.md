# Movie Match API

A professional REST API to explore and discover movies from the IMDb Top 250. Built with Node.js and Express following a clean MVC architecture. Includes AI-powered movie enrichment via OpenRouter.

## Description

Movie Match API is a backend application that provides endpoints to query, filter, sort, and paginate movies. It follows separation of concerns with dedicated layers for routes, controllers, services, filters, and middlewares.

## Technologies Used

- **Node.js** - JavaScript runtime for server-side development
- **Express.js v5.2.1** - Minimalist and flexible web framework
- **ES Modules (ESM)** - Modern JavaScript module system
- **Nodemon v3.1.11** - Development tool for auto-reload
- **Swagger UI Express** - Interactive API documentation
- **YAMLJS** - YAML parser for OpenAPI spec
- **CORS** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

## Architecture

### Project Structure

```
movie-match-api/
├── data/
│   └── movies.js                          # Dataset of 30 movies from IMDb Top 250
├── docs/
│   └── swagger.yaml                       # OpenAPI 3.0 documentation
├── src/
│   ├── controllers/
│   │   └── movies.controller.js           # Request/response handling
│   ├── middlewares/
│   │   ├── cors.middleware.js             # CORS configuration
│   │   ├── errorHandler.middleware.js     # Global error handling
│   │   ├── logger.middleware.js           # Request logging with timestamp
│   │   ├── notFound.middleware.js         # Centralized 404 handler
│   │   └── index.js                      # Barrel export for middlewares
│   ├── routes/
│   │   └── movies.routes.js              # Endpoint definitions
│   ├── services/
│   │   ├── movies.service.js             # Business logic, sorting, pagination
│   │   └── ai.service.js                 # AI enrichment via OpenRouter
│   ├── filters/
│   │   └── movies.filters.js             # Pure filter functions
│   └── utils/
│       └── response.js                   # Response format helpers
├── .env.example                           # Environment variables template
├── .gitignore
├── index.js                               # Server bootstrap
├── package.json
└── README.md
```

### Design Patterns

- **MVC Architecture**: Routes → Controllers → Services → Data
- **Middleware Pipeline**: CORS → Logger → Body Parser → Routes → NotFound → ErrorHandler
- **Pure Functions**: Filters with no side effects
- **Barrel Exports**: Single entry point for middlewares
- **Graceful Degradation**: AI features fail silently
- **ES Modules**: Modern `import/export` syntax

## Middlewares

The API includes a professional middleware pipeline:

| Middleware       | File                         | Description                                      |
|------------------|------------------------------|--------------------------------------------------|
| CORS             | `cors.middleware.js`         | Centralized Cross-Origin configuration           |
| Logger           | `logger.middleware.js`       | Logs each request with timestamp and duration    |
| Body Parser      | Built-in `express.json()`   | Parses JSON request bodies                       |
| Not Found        | `notFound.middleware.js`     | Returns standardized 404 for undefined routes    |
| Error Handler    | `errorHandler.middleware.js` | Catches unhandled errors with environment-aware response |

### Middleware Execution Order

```
Request → CORS → Logger → express.json() → Routes → NotFound → ErrorHandler → Response
```

### Logger Output Example

```
[2026-01-29T10:30:45.123Z] GET /api/movies 200 - 12ms
[2026-01-29T10:30:46.456Z] GET /api/movies/999 404 - 3ms
```

## API Endpoints

### 1. Welcome

```http
GET /
```

**Response:**
```json
{
  "message": "Welcome to Movie Match API",
  "endpoints": {
    "allMovies": "GET /api/movies",
    "movieById": "GET /api/movies/:id",
    "randomMovie": "GET /api/movies/random",
    "stats": "GET /api/movies/stats",
    "discover": "GET /api/movies/discover",
    "documentation": "GET /docs"
  }
}
```

### 2. List all movies (with filters, sorting, and pagination)

```http
GET /api/movies
```

**Query Parameters (all optional and combinable):**

| Parameter  | Description                        | Example              |
|------------|------------------------------------|----------------------|
| genre      | Filter by genre (case-insensitive) | `?genre=drama`       |
| minRating  | Minimum rating                     | `?minRating=8.5`     |
| year       | Filter by year                     | `?year=1994`         |
| director   | Partial match (case-insensitive)   | `?director=nolan`    |
| sortBy     | Sort field: title, rating, year    | `?sortBy=rating`     |
| order      | Sort direction: asc or desc        | `?order=desc`        |
| page       | Page number (starts at 1)          | `?page=1`            |
| limit      | Results per page                   | `?limit=5`           |

**Example requests:**
```
GET /api/movies?genre=drama&minRating=9.0
GET /api/movies?director=nolan&sortBy=year&order=desc
GET /api/movies?sortBy=rating&order=desc&page=1&limit=5
```

**Success response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### 3. Get movie by ID

```http
GET /api/movies/:id
```

**Success response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": {
    "id": 3,
    "title": "The Dark Knight",
    "year": 2008,
    "genre": ["Action", "Crime", "Drama"],
    "rating": 9.0,
    "director": "Christopher Nolan",
    "description": "When the menace known as the Joker..."
  }
}
```

**Error response (400):**
```json
{
  "success": false,
  "error": "Invalid movie ID"
}
```

**Error response (404):**
```json
{
  "success": false,
  "error": "Movie not found"
}
```

### 4. Random movie

```http
GET /api/movies/random
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": {
    "id": 15,
    "title": "Whiplash",
    "year": 2014,
    "genre": ["Drama", "Music"],
    "rating": 8.5,
    "director": "Damien Chazelle",
    "description": "A promising young drummer..."
  }
}
```

### 5. Movie statistics

```http
GET /api/movies/stats
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": {
    "totalMovies": 30,
    "byGenre": {
      "Drama": 25,
      "Crime": 8,
      "Action": 6
    }
  }
}
```

### 6. Discover movies (AI-enriched)

```http
GET /api/movies/discover?count=3
```

Returns random movies enriched with AI-generated content (anecdotes, fun facts, and pitch).

| Parameter | Description              | Default |
|-----------|--------------------------|---------|
| count     | Number of movies (1-30)  | 3       |

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "The Shawshank Redemption",
      "year": 1994,
      "ai_enriched": {
        "anecdote": "Tim Robbins kept the poster...",
        "funFact": "Morgan Freeman was not the first choice...",
        "pitch": "A timeless tale of hope..."
      }
    }
  ]
}
```

> **Note:** If `OPENROUTER_API_KEY` is not set, movies are returned with `ai_enriched: null`.

### 7. API Documentation (Swagger UI)

```http
GET /docs
```

Interactive API documentation powered by Swagger UI. Allows testing all endpoints directly from the browser.

## Installation and Usage

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

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
# Edit .env and add your OpenRouter API key
```

### Environment Variables

| Variable            | Description                          | Required | Default |
|---------------------|--------------------------------------|----------|---------|
| PORT                | Server port                          | No       | 3000    |
| OPENROUTER_API_KEY  | API key from OpenRouter              | No*      | -       |
| CORS_ORIGIN         | Allowed origins for CORS             | No       | *       |

*Required only for the `/api/movies/discover` AI enrichment feature.

### Running the Application

#### Production Mode
```bash
npm start
```

#### Development Mode (with auto-reload)
```bash
npm run dev
```

The server will be available at `http://localhost:3000`

### Testing the API

**Option 1: Swagger UI**
```
http://localhost:3000/docs
```

**Option 2: Browser**
```
http://localhost:3000/api/movies?genre=action&sortBy=rating&order=desc
```

**Option 3: cURL**
```bash
curl "http://localhost:3000/api/movies?sortBy=rating&order=desc&page=1&limit=5"
```

**Option 4: Thunder Client / Postman**
- Method: GET
- URL: `http://localhost:3000/api/movies/discover?count=3`

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon (auto-reload)
- `npm test` - Placeholder for future tests

## Labs Completed

### Lab 10: Professional REST API

- Filters: genre, minRating, year, director (combinable)
- Sorting: by title, rating, or year (asc/desc)
- Pagination: page and limit support
- Statistics endpoint
- Modular MVC architecture
- Consistent response format

### Lab 11: AI Integration

- **AI Service**: OpenRouter integration with Llama 3.2
- **Discover Endpoint**: `GET /api/movies/discover`
- **Graceful Degradation**: Works without API key (returns `ai_enriched: null`)

### Lab 12: Middleware, Documentation & Deploy Preparation

- **Middlewares**: Logger, CORS, NotFound (404), ErrorHandler (500)
- **Middleware Pipeline**: Professional execution order with centralized error handling
- **Swagger Documentation**: Full OpenAPI 3.0 spec with reusable schemas
- **Swagger UI**: Interactive docs at `/docs`
- **Environment Variables**: `process.env.PORT` with fallback, `.env.example` template
- **Deploy Ready**: CORS configured, error handling environment-aware (dev vs production)

## Layer Responsibilities

| Layer       | File                         | Responsibility                          |
|-------------|------------------------------|-----------------------------------------|
| Bootstrap   | `index.js`                   | Initialize Express, middlewares, routes  |
| Middleware  | `logger.middleware.js`       | Log requests with timestamp             |
| Middleware  | `cors.middleware.js`         | CORS configuration                      |
| Middleware  | `notFound.middleware.js`     | Centralized 404 handler                 |
| Middleware  | `errorHandler.middleware.js` | Global error handler                    |
| Routes      | `movies.routes.js`           | Define endpoints, delegate to controller|
| Controller  | `movies.controller.js`       | Handle req/res, orchestrate services    |
| Service     | `movies.service.js`          | Business logic, sorting, pagination     |
| Service     | `ai.service.js`              | AI enrichment via OpenRouter            |
| Filters     | `movies.filters.js`          | Pure filter functions                   |
| Utils       | `response.js`                | Standardized response helpers           |
| Docs        | `swagger.yaml`               | OpenAPI 3.0 specification               |

## Author

**Yuliana GP**

- GitHub: [@YulianaGP](https://github.com/YulianaGP)
- Project: [movie-match-api](https://github.com/YulianaGP/movie-match-api)

## License

ISC
