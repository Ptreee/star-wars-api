import express from 'express';
import {
  createFavorites,
  getAllFavorites,
  getSingleFavorite,
  getSingleFavoriteFile,
} from '../controllers/favorites';

const router = express.Router();

router.get('/', getAllFavorites);
router.post('/', createFavorites);
router.get('/:id', getSingleFavorite);
router.get('/:id/file', getSingleFavoriteFile);

export default router;
