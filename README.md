# Movie Match API

A professional REST API to explore and discover movies from the IMDb Top 250. Built with Node.js and Express following a clean, layered architecture as part of **Lab 10: Professional REST**.

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
│   │   └── movies.service.js      # Business logic, sorting, pagination
│   ├── filters/
│   │   └── movies.filters.js      # Pure filter functions
│   └── utils/
│       └── response.js            # Response format helpers
├── index.js                       # Server bootstrap
├── package.json
├── .gitignore
└── README.md
```

### Application Architecture

```
Client (Browser/Thunder Client)
         │
         ▼
    HTTP Request
         │
         ▼
┌────────────────────┐
│   Express Server   │
│    (index.js)      │  ← Bootstrap only
└────────────────────┘
         │
         ▼
┌────────────────────┐
│      Routes        │  ← Endpoint definitions
│ (movies.routes.js) │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│    Controllers     │  ← req/res handling
│ (movies.controller)│
└────────────────────┘
         │
         ▼
┌────────────────────┐
│     Services       │  ← Business logic, sorting, pagination
│ (movies.service)   │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│     Filters        │  ← Pure filter functions
│ (movies.filters)   │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│    Data Layer      │
│  (data/movies.js)  │
└────────────────────┘
         │
         ▼
    JSON Response
```

### Design Patterns Used

- **Layered Architecture**: Routes → Controllers → Services → Filters
- **Pure Functions**: Filters with no side effects
- **Separation of Concerns**: Each layer has a single responsibility
- **RESTful API**: Endpoint design following REST principles
- **ES Modules**: Use of `import/export` instead of `require`
- **Consistent Responses**: Standardized success/error format

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
GET /movies
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
GET /movies?genre=drama&minRating=9.0
GET /movies?director=nolan&sortBy=year&order=desc
GET /movies?sortBy=rating&order=desc&page=1&limit=5
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
GET /movies/:id
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
GET /movies/random
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
GET /movies/stats
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
      "Action": 6,
      "Sci-Fi": 4,
      "Thriller": 4,
      "Adventure": 5,
      "Mystery": 3,
      "Biography": 3,
      "Romance": 1,
      "Animation": 2,
      "Comedy": 2,
      "Fantasy": 2,
      "Music": 2,
      "War": 1,
      "History": 1,
      "Family": 1
    }
  }
}
```

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
http://localhost:3000/movies?genre=action&sortBy=rating&order=desc
```

**Option 2: cURL**
```bash
curl "http://localhost:3000/movies?sortBy=rating&order=desc&page=1&limit=5"
```

**Option 3: Thunder Client / Postman**
- Create new request
- Method: GET
- URL: `http://localhost:3000/movies?genre=drama&minRating=9`

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon (auto-reload)
- `npm test` - Placeholder for future tests

## Lab 10: Professional REST - User Stories

### Completed User Stories

- **HU1: Filter movies by genre** ✅
  - Case-insensitive genre filtering
  - `GET /movies?genre=drama`

- **HU2: Combinable filters** ✅
  - genre, minRating, year, director (partial match)
  - All filters can be combined in a single request
  - `GET /movies?genre=drama&minRating=8.5&director=nolan`

- **HU3: Modular routes with express.Router()** ✅
  - Routes defined in `src/routes/movies.routes.js`
  - Mounted in `index.js` via `app.use('/movies', moviesRouter)`

- **HU4: Consistent response format** ✅
  - Success: `{ success: true, count, data }`
  - Error: `{ success: false, error }`
  - Helpers in `src/utils/response.js`

### Additional Achievements

- **Sorting** ✅
  - Sort by `title`, `rating`, or `year`
  - Ascending or descending order
  - Applied after filters
  - `GET /movies?sortBy=rating&order=desc`

- **Pagination** ✅
  - Page and limit support via query params
  - Returns all results when not specified
  - Protection against invalid values
  - `GET /movies?page=1&limit=5`

- **Statistics** ✅
  - `GET /movies/stats`
  - Returns total movie count and breakdown by genre
  - Calculated with `reduce` for efficiency

## Layer Responsibilities

| Layer      | File                    | Responsibility                          |
|------------|-------------------------|-----------------------------------------|
| Bootstrap  | `index.js`              | Initialize Express, mount router        |
| Routes     | `movies.routes.js`      | Define endpoints, delegate to controller|
| Controller | `movies.controller.js`  | Handle req/res, call service            |
| Service    | `movies.service.js`     | Business logic, sorting, pagination     |
| Filters    | `movies.filters.js`     | Pure filter functions                   |
| Utils      | `response.js`           | Standardized response helpers           |

## Author

**Yuliana GP**

- GitHub: [@YulianaGP](https://github.com/YulianaGP)
- Project: [movie-match-api](https://github.com/YulianaGP/movie-match-api)

## License

ISC
