export const filterByGenre = (movies, genre) => {
  const genreLower = genre.toLowerCase();
  return movies.filter(movie =>
    movie.genre.some(g => g.toLowerCase() === genreLower)
  );
};

export const filterByMinRating = (movies, minRating) => {
  return movies.filter(movie => movie.rating >= minRating);
};

export const filterByYear = (movies, year) => {
  return movies.filter(movie => movie.year === year);
};

export const filterByDirector = (movies, director) => {
  const directorLower = director.toLowerCase();
  return movies.filter(movie =>
    movie.director.toLowerCase().includes(directorLower)
  );
};
