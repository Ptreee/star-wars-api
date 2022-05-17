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
exports.getAllCharacters = void 0;
const models_1 = require("../models/");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fetchCharacters = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, node_fetch_1.default)(`https://swapi.dev/api/people/?page=${page}`);
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error('Problem with Character fetching');
    }
});
const getAllCharacters = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // [fetching all characters]
        const characterTable = yield models_1.Character.findAll({});
        // [existence check]
        if (characterTable.length < 10) {
            let tempCharacters = [];
            for (let i = 1; i < 10; i++) {
                // @ts-ignore
                const data = yield fetchCharacters([i]);
                tempCharacters.push(data.results);
            }
            // [creating ID] for each character from provided URLs
            let characters = tempCharacters
                .flat(2)
                .map((char) => ({
                character_id: parseInt(char.url.replace(/\D/g, '')),
                name: char.name,
                filmID: char.films.map((film) => {
                    return Number(film.replace(/\D/g, ''));
                }),
            }));
            // [insert] data to table
            yield models_1.Character.bulkCreate(characters, {
                validate: true,
                ignoreDuplicates: true,
            });
        }
        else {
            console.log(`[Characters Table] already populated with ${characterTable.length} records`);
            return;
        }
    }
    catch (error) {
        console.error(error);
        throw new Error('Character : Data Base problem');
    }
});
exports.getAllCharacters = getAllCharacters;
