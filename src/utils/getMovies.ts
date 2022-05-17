import { Movie } from '../models';
import fetch from 'node-fetch';

interface RawMovie {
  id: number;
  url: string;
  title: string;
  release_date: string;
  characters: string[];
}

export const getAllMovies = async () => {
  let movies;
  try {
    // [Check] is db empty
    const moviesTable = await Movie.findAll({});
    if (moviesTable.length < 5) {
      // [getting film data]
      const response = await fetch('https://swapi.dev/api/films/');
      const data = await response.json();
      // [Prepare & Import] data to DB
      movies = data.results.map((movie: RawMovie) => ({
        movie_id: parseInt(movie.url.replace(/\D/g, '')),
        movieTitle: movie.title,
        releaseDate: movie.release_date,
        charactersInMovie: movie.characters.map((character) => {
          return parseInt(character.replace(/\D/g, ''));
        }),
      }));
      await Movie.bulkCreate(movies, {
        validate: true,
        ignoreDuplicates: true,
      });
    } else {
      console.log(
        `[Movies Table] already populated with ${moviesTable.length} records`,
      );
      return;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Movie : Data Base problem');
  }
};
