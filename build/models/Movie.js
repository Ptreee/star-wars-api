"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connect_1 = __importDefault(require("../db/connect"));
const Movie = connect_1.default.define('Movie', {
    movie_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    movieTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    releaseDate: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    charactersInMovie: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
}, {
    timestamps: false,
});
exports.default = Movie;
