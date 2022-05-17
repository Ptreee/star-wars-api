"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connect_1 = __importDefault(require("../db/connect"));
const Movie_1 = __importDefault(require("./Movie"));
const Character_1 = __importDefault(require("./Character"));
const Movie_Character = connect_1.default.define('Movie_Character', {
    movie_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Movie_1.default,
            key: 'movie_id',
        },
    },
    character_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Character_1.default,
            key: 'character_id',
        },
    },
}, {
    timestamps: false,
});
exports.default = Movie_Character;
