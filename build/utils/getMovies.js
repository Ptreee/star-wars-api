"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMovies = void 0;
const models_1 = require("../models");
const node_fetch_1 = __importDefault(require("node-fetch"));
const getAllMovies = () => __awaiter(void 0, void 0, void 0, function* () {
    let movies;
    try {
        // [Check] is db empty
        const moviesTable = yield models_1.Movie.findAll({});
        if (moviesTable.length < 5) {
            // [getting film data]
            const response = yield (0, node_fetch_1.default)('https://swapi.dev/api/films/');
            const data = yield response.json();
            // [Prepare & Import] data to DB
            movies = data.results.map((movie) => ({
                movie_id: parseInt(movie.url.replace(/\D/g, '')),
                movieTitle: movie.title,
                releaseDate: movie.release_date,
                charactersInMovie: movie.characters.map((character) => {
                    return parseInt(character.replace(/\D/g, ''));
                }),
            }));
            yield models_1.Movie.bulkCreate(movies, {
                validate: true,
                ignoreDuplicates: true,
            });
        }
        else {
            console.log(`[Movies Table] already populated with ${moviesTable.length} records`);
            return;
        }
    }
    catch (error) {
        console.error(error);
        throw new Error('Movie : Data Base problem');
    }
});
exports.getAllMovies = getAllMovies;
