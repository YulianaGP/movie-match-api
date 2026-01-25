import { movies } from '../../data/movies.js';
import {
  filterByGenre,
  filterByMinRating,
  filterByYear,
  filterByDirector
} from '../filters/movies.filters.js';

const applyFilters = (data, filters) => {
  let result = [...data];

  if (filters.genre) {
    result = filterByGenre(result, filters.genre);
  }

  if (filters.minRating) {
    result = filterByMinRating(result, Number(filters.minRating));
  }

  if (filters.year) {
    result = filterByYear(result, Number(filters.year));
  }

  if (filters.director) {
    result = filterByDirector(result, filters.director);
  }

  return result;
};

const ALLOWED_SORT_FIELDS = ['title', 'rating', 'year'];

const applySorting = (data, sortBy, order = 'asc') => {
  if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
    return data;
  }

  const direction = order === 'desc' ? -1 : 1;

  return [...data].sort((a, b) => {
    if (typeof a[sortBy] === 'string') {
      return direction * a[sortBy].localeCompare(b[sortBy]);
    }
    return direction * (a[sortBy] - b[sortBy]);
  });
};

const applyPagination = (data, page, limit) => {
  if (page < 1 || limit < 1) return data;

  const start = (page - 1) * limit;
  return data.slice(start, start + limit);
};

export const getAllMovies = (filters = {}) => {
  let result = applyFilters(movies, filters);

  if (filters.sortBy) {
    result = applySorting(result, filters.sortBy, filters.order);
  }

  if (filters.page && filters.limit) {
    result = applyPagination(result, Number(filters.page), Number(filters.limit));
  }

  return result;
};

export const getMovieById = (id) => {
  return movies.find(movie => movie.id === id);
};

export const getRandomMovie = () => {
  const randomIndex = Math.floor(Math.random() * movies.length);
  return movies[randomIndex];
};

export const getRandomMovies = (count = 3) => {
  const safeCount = Number.isInteger(count) && count > 0 ? count : 3;
  const limit = Math.min(safeCount, movies.length);

  const shuffled = [...movies].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
};

export const getStats = () => {
  return movies.reduce(
    (acc, movie) => {
      acc.totalMovies += 1;

      movie.genre.forEach(g => {
        acc.byGenre[g] = (acc.byGenre[g] || 0) + 1;
      });

      return acc;
    },
    { totalMovies: 0, byGenre: {} }
  );
};
