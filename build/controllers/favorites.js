"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getSingleFavoriteFile = exports.getSingleFavorite = exports.getAllFavorites = exports.createFavorites = void 0;
const XLSX = __importStar(require("xlsx"));
const sequelize_1 = require("sequelize");
const http_status_codes_1 = require("http-status-codes");
const userInputCleaner_1 = require("../utils/userInputCleaner");
const models_1 = require("../models");
const createFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { list_name, movie_id } = req.body;
        // [Input] sanitizing
        const cleanListName = (0, userInputCleaner_1.listNameCleaner)(list_name);
        if (!cleanListName || cleanListName.length === 0) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ msg: 'Please provide name for the list' });
        }
        const cleanMovieId = (0, userInputCleaner_1.movieIdCleaner)(movie_id);
        if (!cleanMovieId || cleanMovieId.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                msg: 'Please provide valid movie IDs [from 1 to 6]',
            });
        }
        // [check] if favList name already exists.
        const entryExistence = yield models_1.favList.findOne({
            where: {
                list_name: cleanListName,
            },
        });
        if (entryExistence !== null) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                msg: 'Favorite list name already taken, please provide another one.',
            });
        }
        // [Getting Movie details for Response]
        const rawFavList = yield models_1.Movie.findAll({
            where: { movie_id: cleanMovieId },
            attributes: { exclude: ['charactersInMovie'] },
            include: [
                {
                    model: models_1.Character,
                    nested: true,
                    attributes: {
                        exclude: ['character_id', 'filmID'],
                    },
                    through: { attributes: [] },
                    required: false,
                },
            ],
        });
        // [Insert] into favList table
        const entry = yield models_1.favList.create({
            list_name: cleanListName,
            movies: cleanMovieId,
        });
        // @ts-ignore
        const { favList_id } = entry.dataValues;
        // [Insert] into junction table
        cleanMovieId.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield models_1.favList_Movie.bulkCreate([{ favList_id, movie_id: item }]);
        }));
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            msg: 'Success! New list created',
            list_id: favList_id,
            list_name: cleanListName,
            movies: rawFavList,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            msg: 'List creation failed',
            error: error.original.detail,
        });
    }
});
exports.createFavorites = createFavorites;
const getAllFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { list_name, page, pageSize } = req.body;
        // [Pagination]
        const paginate = (list_name, { page, pageSize }) => {
            const offset = (page - 1) * pageSize;
            const limit = pageSize;
            return Object.assign(Object.assign({}, list_name), { offset, limit });
        };
        const list = yield models_1.favList.findAndCountAll(paginate({
            // @ts-ignore
            where: {
                list_name: {
                    [sequelize_1.Op.substring]: list_name,
                },
            },
            attributes: { exclude: ['movies'] },
            raw: true,
        }, { page, pageSize }));
        return res.status(http_status_codes_1.StatusCodes.OK).json({ data: list });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            msg: 'Action Failed, please try later',
            error: error.original.detail,
        });
    }
});
exports.getAllFavorites = getAllFavorites;
const getSingleFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: requestedID } = req.params;
    try {
        const result = yield models_1.favList.findOne({
            where: {
                favList_id: requestedID,
            },
            attributes: { exclude: ['movies'] },
            include: [
                {
                    model: models_1.Movie,
                    attributes: { exclude: ['movie_id', 'charactersInMovie'] },
                    through: { attributes: [] },
                    include: [
                        {
                            model: models_1.Character,
                            attributes: { exclude: ['character_id', 'filmID'] },
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({ data: result });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            msg: 'Action Failed, please try later',
            error: error.original.detail,
        });
    }
});
exports.getSingleFavorite = getSingleFavorite;
const getSingleFavoriteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: requestedID } = req.params;
    try {
        // [DATA SEARCH]
        // @ts-ignore
        const data = yield models_1.favList.findOne({
            where: {
                favList_id: requestedID,
            },
        });
        const moviesInFavList = data.movies;
        // @ts-ignore
        const result = yield models_1.favList.findOne({
            where: {
                favList_id: requestedID,
            },
            include: [
                {
                    model: models_1.Movie,
                    attributes: { exclude: ['movie_id', 'charactersInMovie'] },
                    through: { attributes: [] },
                    include: [
                        {
                            model: models_1.Character,
                            attributes: { exclude: ['character_id', 'filmID'] },
                            through: { attributes: [] },
                            include: [
                                {
                                    model: models_1.Movie,
                                    where: { movie_id: moviesInFavList },
                                    attributes: {
                                        exclude: ['movie_id', 'releaseDate', 'charactersInMovie'],
                                    },
                                    through: { attributes: [] },
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        let dataFromSearch = result.Movies.flatMap((item) => item.Characters);
        // [filter uniques]
        const cleanFromDuplicatesData = [
            ...new Map(dataFromSearch.map((item) => [item['name'], item])).values(),
        ];
        // [movies transform] from object to string
        let dataToSheet = cleanFromDuplicatesData.map(
        // @ts-ignore
        (character) => {
            let movies = character.Movies.map((movie) => movie.movieTitle).join(', ');
            return { name: character.name, movies };
        });
        // [create EXCEL file]
        const workSheet = XLSX.utils.json_to_sheet(dataToSheet);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'characters');
        XLSX.utils.sheet_add_aoa(workSheet, [['Name', 'Movies']], {
            origin: 'A1',
        });
        const max_width = dataToSheet.reduce((w, r) => Math.max(w, r.name.length), 10);
        workSheet['!cols'] = [{ wch: max_width }];
        XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });
        XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' });
        XLSX.writeFile(workBook, 'starWarsCharacters.xlsx');
        return res.status(http_status_codes_1.StatusCodes.OK).download('starWarsCharacters.xlsx');
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            msg: 'Action Failed, please try later',
            error: error.original.detail,
        });
    }
});
exports.getSingleFavoriteFile = getSingleFavoriteFile;
