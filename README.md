# Movie Match API

A modern REST API to explore and discover movies from the IMDb Top 250. Built with Node.js and Express as part of **Lab 09: Express Fundamentals**.

## Description

Movie Match API is a backend application that provides endpoints to query information about classic and popular movies. It includes features to list movies, search by ID, and get random recommendations.

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
│   └── movies.js          # Dataset of 30 movies from IMDb Top 250
├── index.js               # Express server and route definitions
├── package.json           # Project configuration and dependencies
├── .gitignore            # Files excluded from repository
└── README.md             # Project documentation
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
│    (index.js)      │
└────────────────────┘
         │
         ├─── GET /                → Welcome message
         ├─── GET /movies          → List all movies
         ├─── GET /movies/random   → Random movie
         └─── GET /movies/:id      → Movie by ID
         │
         ▼
┌────────────────────┐
│   Data Layer       │
│  (data/movies.js)  │
└────────────────────┘
         │
         ▼
    JSON Response
```

### Design Patterns Used

- **RESTful API**: Endpoint design following REST principles
- **Separation of Concerns**: Separation of data (data/) and server logic (index.js)
- **ES Modules**: Use of `import/export` instead of `require`
- **Route Parameters**: Dynamic parameters in URLs (`/movies/:id`)
- **HTTP Status Codes**: Appropriate responses (200, 404)

## API Endpoints

### 1. Welcome and documentation
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

### 2. List all movies
```http
GET /movies
```
**Response:** Array of 30 movie objects
```json
[
  {
    "id": 1,
    "title": "The Shawshank Redemption",
    "year": 1994,
    "genre": ["Drama"],
    "rating": 9.3,
    "director": "Frank Darabont",
    "description": "Two imprisoned men bond..."
  },
  ...
]
```

### 3. Get movie by ID
```http
GET /movies/:id
```
**Parameters:**
- `id` (number) - Movie ID (1-30)

**Successful response (200):**
```json
{
  "id": 3,
  "title": "The Dark Knight",
  "year": 2008,
  "genre": ["Action", "Crime", "Drama"],
  "rating": 9.0,
  "director": "Christopher Nolan",
  "description": "When the menace known as the Joker..."
}
```

**Error response (404):**
```json
{
  "error": "Movie not found",
  "id": 999
}
```

### 4. Random movie
```http
GET /movies/random
```
**Response:** A randomly selected movie object
```json
{
  "id": 15,
  "title": "Whiplash",
  "year": 2014,
  "genre": ["Drama", "Music"],
  "rating": 8.5,
  "director": "Damien Chazelle",
  "description": "A promising young drummer..."
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
http://localhost:3000/movies
```

**Option 2: cURL**
```bash
curl http://localhost:3000/movies/1
```

**Option 3: Thunder Client / Postman**
- Create new request
- Method: GET
- URL: `http://localhost:3000/movies`

## Development

### Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon (auto-reload)
- `npm test` - Placeholder for future tests

### Configuration Variables

```javascript
const PORT = 3000; // Server port (configurable in index.js)
```

## Lab 09 Summary

This project was developed following the user stories from **Lab 09: Express Fundamentals**:

### Completed User Stories

- **HU1: Express Server Setup** ✅
  - Express server configured and running on port 3000
  - JSON response on root route with welcome message

- **HU2: List all movies** ✅
  - `GET /movies` endpoint implemented
  - Returns complete array of 30 movies
  - Status code 200

- **HU3: Get movie by ID** ✅
  - `GET /movies/:id` endpoint implemented
  - ID validation with 404 response for non-existent IDs
  - Use of `req.params` to capture route parameters

- **HU4: Random movie (STRETCH GOAL)** ✅
  - `GET /movies/random` endpoint implemented
  - Returns different movie on each call
  - Implemented before `/movies/:id` to avoid route conflicts

### Additional Achievements Implemented

- **Nodemon installed** ✅ - More efficient development with auto-reload
- **Optimized npm scripts** ✅ - `start` and `dev` scripts configured
- **Expanded dataset** ✅ - From 15 to 30 movies from IMDb Top 250
- **Professional documentation** ✅ - Complete README with architecture and examples

## Concepts Learned

1. **HTTP server creation** with Express
2. **Routing and RESTful endpoints**
3. **Request parameters** (`req.params`)
4. **Appropriate HTTP Status Codes** (200, 404)
5. **ES Modules** (`import/export`)
6. **Separation of responsibilities** (data vs logic)
7. **Development tools** (nodemon)

## Next Steps

This is the first module of a 4-part project. The following labs will implement:

- Integration with external APIs (TMDB, OpenAI)
- Authentication middleware
- Swagger documentation
- Cloud deployment

## Author

**Yuliana GP**

- GitHub: [@YulianaGP](https://github.com/YulianaGP)
- Project: [movie-match-api](https://github.com/YulianaGP/movie-match-api)

## License

ISC