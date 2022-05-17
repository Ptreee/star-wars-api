"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connect_1 = __importDefault(require("../db/connect"));
const Movie_1 = __importDefault(require("./Movie"));
const favList_1 = __importDefault(require("./favList"));
const favList_Movie = connect_1.default.define('favList_Movie', {
    favList_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: favList_1.default,
            key: 'favList_id',
        },
    },
    movie_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Movie_1.default,
            key: 'movie_id',
        },
    },
}, {
    timestamps: false,
});
exports.default = favList_Movie;
