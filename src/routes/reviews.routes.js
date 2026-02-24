import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/reviews.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { movieIdParamSchema } from '../schemas/movie.schema.js';
import { createReviewSchema, updateReviewSchema, reviewParamsSchema } from '../schemas/review.schema.js';

/**
 * mergeParams: true allows this router to access :movieId from the parent
 * route (/movies/:movieId/reviews). Without it, req.params.movieId would
 * be undefined inside these handlers.
 */
const router = Router({ mergeParams: true });

// GET  /movies/:movieId/reviews
router.get('/', validate(movieIdParamSchema, 'params'), getAll);

// POST /movies/:movieId/reviews
router.post('/', validate(movieIdParamSchema, 'params'), validate(createReviewSchema), create);

// PUT  /movies/:movieId/reviews/:reviewId
router.put('/:reviewId', validate(reviewParamsSchema, 'params'), validate(updateReviewSchema), update);

// DELETE /movies/:movieId/reviews/:reviewId
router.delete('/:reviewId', validate(reviewParamsSchema, 'params'), remove);

export default router;
