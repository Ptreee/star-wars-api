import { DataTypes } from 'sequelize';
import sequelize from '../db/connect';

const favList = sequelize.define(
  'favList',
  {
    favList_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    list_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    movies: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
  },
  {
    timestamps: false,
  },
);

export default favList;
