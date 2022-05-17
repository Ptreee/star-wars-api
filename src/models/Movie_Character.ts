import { DataTypes } from 'sequelize';
import sequelize from '../db/connect';
import Movie from './Movie';
import Character from './Character';

const Movie_Character = sequelize.define(
  'Movie_Character',
  {
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,
        key: 'movie_id',
      },
    },
    character_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Character,
        key: 'character_id',
      },
    },
  },
  {
    timestamps: false,
  },
);

export default Movie_Character;
