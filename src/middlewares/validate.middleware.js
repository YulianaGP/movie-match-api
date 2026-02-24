/**
 * Generic Zod validation middleware factory.
 *
 * HOW IT WORKS:
 * This is a "higher-order function" — a function that RETURNS a function.
 * When you write: validate(createMovieSchema, 'body')
 * It returns a middleware function that Express can use.
 *
 * THE FLOW:
 * 1. Request arrives at route (e.g., POST /movies)
 * 2. Express runs this middleware BEFORE the controller
 * 3. Zod parses req.body (or req.query or req.params)
 * 4a. If valid → stores clean data in req.validated, calls next()
 * 4b. If invalid → throws ZodError → caught by errorHandler middleware
 *
 * WHY req.validated INSTEAD OF MUTATING req.body?
 * - req.body contains the raw user input (untouched)
 * - req.validated contains the parsed, trimmed, coerced, clean data
 * - This separation makes debugging easier — you can always check what arrived vs. what was validated
 *
 * USAGE IN ROUTES:
 *   router.post('/', validate(createMovieSchema), createHandler);
 *   router.get('/search', validate(searchQuerySchema, 'query'), searchHandler);
 *   router.delete('/:id', validate(idParamSchema, 'params'), deleteHandler);
 */
export const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    // .parse() throws ZodError if validation fails
    // Our errorHandler middleware catches it and returns a 400 response
    const validated = schema.parse(req[source]);

    // Merge validated data into a single place the controller can trust
    req.validated = { ...req.validated, ...validated };

    next();
  };
};
