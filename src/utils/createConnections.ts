import { ModelDefined } from 'sequelize/types';
import { Movie, Movie_Character } from '../models';
import { MovieInterface } from './interface';

export const createConnections = async () => {
  let movie_id: number, character_id: number;
  try {
    const connections = await Movie_Character.findAll({});
    if (connections.length < 1) {
      const movies = await Movie.findAll({ raw: true });
      // @ts-ignore
      movies.map(async (movie: MovieInterface) => {
        movie.charactersInMovie.map(async (character) => {
          character_id = character;
          movie_id = movie.movie_id;
          await Movie_Character.bulkCreate([{ movie_id, character_id }]);
        });
      });
    } else {
      console.log(
        `[Movie_Character junction Table] already populated with ${connections.length} records`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error('Movie_Character table: Error');
  }
};
