import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Movie } from '../models/index';

export const getAllFilms = async (req: Request, res: Response) => {
  try {
    const data = await Movie.findAll({
      raw: true,
      attributes: { exclude: ['charactersInMovie'] },
    });
    res.status(StatusCodes.OK).json({ movies: data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error });
  }
};
