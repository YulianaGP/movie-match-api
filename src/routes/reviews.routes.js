import { Router } from 'express';
import {
  getAll,
  create,
  update,
  remove,
} from '../controllers/reviews.controller.js';

const router = Router({ mergeParams: true });

// GET  /movies/:movieId/reviews
router.get('/', getAll);

// POST /movies/:movieId/reviews
router.post('/', create);

// PUT  /movies/:movieId/reviews/:reviewId
router.put('/:reviewId', update);

// DELETE /movies/:movieId/reviews/:reviewId
router.delete('/:reviewId', remove);

export default router;
