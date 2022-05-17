import { DataTypes } from 'sequelize';
import sequelize from '../db/connect';

const Movie = sequelize.define(
  'Movie',
  {
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    movieTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    releaseDate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    charactersInMovie: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
  },
  {
    timestamps: false,
  },
);

export default Movie;
