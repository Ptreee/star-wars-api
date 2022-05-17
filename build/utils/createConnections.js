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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnections = void 0;
const models_1 = require("../models");
const createConnections = () => __awaiter(void 0, void 0, void 0, function* () {
    let movie_id, character_id;
    try {
        const connections = yield models_1.Movie_Character.findAll({});
        if (connections.length < 1) {
            const movies = yield models_1.Movie.findAll({ raw: true });
            // @ts-ignore
            movies.map((movie) => __awaiter(void 0, void 0, void 0, function* () {
                movie.charactersInMovie.map((character) => __awaiter(void 0, void 0, void 0, function* () {
                    character_id = character;
                    movie_id = movie.movie_id;
                    yield models_1.Movie_Character.bulkCreate([{ movie_id, character_id }]);
                }));
            }));
        }
        else {
            console.log(`[Movie_Character junction Table] already populated with ${connections.length} records`);
        }
    }
    catch (error) {
        console.error(error);
        throw new Error('Movie_Character table: Error');
    }
});
exports.createConnections = createConnections;
