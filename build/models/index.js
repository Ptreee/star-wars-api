"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favList_Movie = exports.Movie_Character = exports.favList = exports.Character = exports.Movie = void 0;
const Movie_1 = __importDefault(require("./Movie"));
exports.Movie = Movie_1.default;
const Character_1 = __importDefault(require("./Character"));
exports.Character = Character_1.default;
const favList_1 = __importDefault(require("./favList"));
exports.favList = favList_1.default;
const Movie_Character_1 = __importDefault(require("./Movie_Character"));
exports.Movie_Character = Movie_Character_1.default;
const favList_Movie_1 = __importDefault(require("./favList_Movie"));
exports.favList_Movie = favList_Movie_1.default;
// [ASSOCIATIONS]
Movie_1.default.belongsToMany(Character_1.default, {
    through: Movie_Character_1.default,
    foreignKey: 'movie_id',
});
Character_1.default.belongsToMany(Movie_1.default, {
    through: Movie_Character_1.default,
    foreignKey: 'character_id',
});
favList_1.default.belongsToMany(Movie_1.default, {
    through: favList_Movie_1.default,
    foreignKey: 'favList_id',
});
Movie_1.default.belongsToMany(favList_1.default, {
    through: favList_Movie_1.default,
    foreignKey: 'movie_id',
});
