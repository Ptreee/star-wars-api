import { DataTypes } from 'sequelize';
import sequelize from '../db/connect';

const Character = sequelize.define(
  'Character',
  {
    character_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    filmID: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

export default Character;
