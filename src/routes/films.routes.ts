import express from 'express';
import { getAllFilms } from '../controllers/films';

const router = express.Router();

router.get('/', getAllFilms);

export default router;
