import { DataTypes } from 'sequelize';
import sequelize from '../db/connect';
import Movie from './Movie';
import favList from './favList';

const favList_Movie = sequelize.define(
  'favList_Movie',
  {
    favList_id: {
      type: DataTypes.INTEGER,
      references: {
        model: favList,
        key: 'favList_id',
      },
    },
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,
        key: 'movie_id',
      },
    },
  },
  {
    timestamps: false,
  },
);

export default favList_Movie;
