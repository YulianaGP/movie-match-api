# Movie Match API

A professional REST API to explore and discover movies from the IMDb Top 250. Built with Node.js and Express following a clean MVC architecture. Includes AI-powered movie enrichment via OpenRouter.

## Description

Movie Match API is a backend application that provides endpoints to query, filter, sort, and paginate movies. It follows separation of concerns with dedicated layers for routes, controllers, services, and filters.

## Technologies Used

- **Node.js** - JavaScript runtime for server-side development
- **Express.js v5.2.1** - Minimalist and flexible web framework
- **ES Modules (ESM)** - Modern JavaScript module system
- **Nodemon v3.1.11** - Development tool for auto-reload

## Architecture

### Project Structure

```
movie-match-api/
├── data/
│   └── movies.js                  # Dataset of 30 movies from IMDb Top 250
├── src/
│   ├── routes/
│   │   └── movies.routes.js       # Endpoint definitions
│   ├── controllers/
│   │   └── movies.controller.js   # Request/response handling
│   ├── services/
│   │   ├── movies.service.js      # Business logic, sorting, pagination
│   │   └── ai.service.js          # AI enrichment via OpenRouter
│   ├── filters/
│   │   └── movies.filters.js      # Pure filter functions
│   └── utils/
│       └── response.js            # Response format helpers
├── index.js                       # Server bootstrap
├── package.json
├── .gitignore
└── README.md
```

### Design Patterns

- **MVC Architecture**: Routes → Controllers → Services → Data
- **Pure Functions**: Filters with no side effects
- **Graceful Degradation**: AI features fail silently
- **ES Modules**: Modern `import/export` syntax

## API Endpoints

### 1. Welcome

```http
GET /
```

**Response:**
```json
{
  "message": "Welcome to Movie Match API 🎬",
  "endpoints": {
    "allMovies": "GET /movies",
    "movieById": "GET /movies/:id",
    "randomMovie": "GET /movies/random"
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

3. Configure environment variables (optional, for AI features):
```bash
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

### Environment Variables

| Variable            | Description                | Required |
|---------------------|----------------------------|----------|
| OPENROUTER_API_KEY  | API key from OpenRouter    | No*      |

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

**Option 1: Browser**
```
http://localhost:3000/api/movies?genre=action&sortBy=rating&order=desc
```

**Option 2: cURL**
```bash
curl "http://localhost:3000/api/movies?sortBy=rating&order=desc&page=1&limit=5"
```

**Option 3: Thunder Client / Postman**
- Method: GET
- URL: `http://localhost:3000/api/movies/discover?count=3`

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon (auto-reload)
- `npm test` - Placeholder for future tests

## Labs Completed

### Lab 10: Professional REST ✅

- Filters: genre, minRating, year, director (combinable)
- Sorting: by title, rating, or year (asc/desc)
- Pagination: page and limit support
- Statistics endpoint
- Modular MVC architecture
- Consistent response format

### Lab 11: AI Integration ✅

- **AI Service**: OpenRouter integration with Llama 3.2
- **Discover Endpoint**: `GET /api/movies/discover`
- **Graceful Degradation**: Works without API key (returns `ai_enriched: null`)

## Layer Responsibilities

| Layer      | File                    | Responsibility                          |
|------------|-------------------------|-----------------------------------------|
| Bootstrap  | `index.js`              | Initialize Express, mount router        |
| Routes     | `movies.routes.js`      | Define endpoints, delegate to controller|
| Controller | `movies.controller.js`  | Handle req/res, orchestrate services    |
| Service    | `movies.service.js`     | Business logic, sorting, pagination     |
| Service    | `ai.service.js`         | AI enrichment via OpenRouter            |
| Filters    | `movies.filters.js`     | Pure filter functions                   |
| Utils      | `response.js`           | Standardized response helpers           |

## Author

**Yuliana GP**

- GitHub: [@YulianaGP](https://github.com/YulianaGP)
- Project: [movie-match-api](https://github.com/YulianaGP/movie-match-api)

## License

ISC
